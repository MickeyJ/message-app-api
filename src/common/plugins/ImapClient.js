import Imap from 'imap'
import { simpleParser } from 'mailparser'

export default class ImapClient extends Imap{
    constructor(credentials){
        super({
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false,
            },
            authTimeout: 300000,
            // debug: console.log,
            ...credentials,
        });
    }


    createConnection(){
        return new Promise((resolve, reject) => {

            this.once('error', (error) => {
                console.log('[ImapClient] - Connection Error');
                reject(error)
            });
            this.once('ready', () => {
                console.log('[ImapClient] - Connection Made');
                resolve()
            });

            this.once('update', (seqno, info) => {
                console.log('[ImapClient] - Message Updated #' + seqno, info);
            });
            this.once('end', () => {
                console.log('[ImapClient] - Connection Ended');
            });

            this.connect();
        });
    }


    /**
   * Open Box
   * @param box
   * @param openReadOnly
   * @returns {Promise}
   */
    open(box = 'INBOX', openReadOnly = false){
        return new Promise((resolve, reject) => {
            this.openBox(box, openReadOnly, (error, inbox) => {
                if(error) return reject(error);
                console.log('[ImapClient] - Opened Box:', box);
                resolve(inbox);
            })
        })
    }


    /**
   * Search Unread By Email Address
   * @param email
   * @returns {Promise}
   */
    searchUnseenFrom(email){
        return new Promise((resolve, reject) => {
            console.log('[ImapClient] - Searching UNSEEN From', email);
            this.search([ 'UNSEEN', ['FROM', email] ], (searchError, results) => {
                if (searchError) return reject(searchError);

                if(!results.length){
                    const message = `No UNSEEN Emails From ${email}`;
                    const resultError = new Error(message);
                    resultError.description = message;
                    return reject(resultError);
                }

                const searchData = {
                    email,
                    results,
                };

                resolve(searchData);
            });
        })
    }


    /**
   * Fetch Search Results By UID
   * @param searchData
   * @returns {Promise}
   */
    fetchSearchResults(searchData){
        searchData.messages = [];

        return new Promise((resolve, reject) => {

            const f = this.fetch(searchData.results, {
                bodies: '',
                struct: true,
            });

            console.log('[ImapClient] - Fetching Results by UID', searchData.results);

            f.on('message', (msg, seqno) => {

                const message = {
                    id: seqno,
                    uid: null,
                    date: null,
                    body: '',
                };

                msg.once('attributes', (attrs) => {
                    const {
                        uid,
                        date,
                    } = attrs;
                    message.uid = uid;
                    message.date = date;
                    console.log('[ImapClient] - Found Message', JSON.stringify({ uid, date }, null, 2));
                });

                msg.on('body', (stream) => {
                    message.body = stream;
                });

                msg.once('end', () => {
                    searchData.messages.push(message);
                });

            });

            f.once('error', (msgError) => {
                reject(msgError);
            });

            f.once('end', () => {
                console.log('[ImapClient] - Done Fetching Messages From:', searchData.email);
                resolve(searchData);
            });

        })
    }


  /**
   * Parse
   * @param searchData
   * @returns {Promise.<*>}
   */
  parseMessages = async (searchData) => {
      searchData.parsed = [];
      for(const message of searchData.messages){
          const email = await simpleParser(message.body);
          searchData.parsed.push({
              uid: message.uid,
              date: message.date,
              subject: email.subject,
              data: {},
              text: email.text,
          });
      }
      return await searchData;
  };


  /**
   * Move Search Results To Another Box
   * @param searchData
   * @param box
   * @returns {Promise}
   */
  moveResultsTo(searchData, box){
      return new Promise((resolve, reject) => {
          this.move(searchData.results, box, (error) => {
              if(error) return reject(error);
              console.log('[ImapClient] - Moved Messages To Box:', box, searchData.results);
              resolve(searchData);
          })
      })
  }


  /**
   * Mark Search Results As SEEN
   * @param searchData
   * @returns {Promise}
   */
  markSeenResults(searchData){
      return new Promise((resolve, reject) => {
          this.setFlags(searchData.results, ['\\Seen'], (error) => {
              if(error) return reject(error);
              resolve(searchData);
          })
      })
  }


}

