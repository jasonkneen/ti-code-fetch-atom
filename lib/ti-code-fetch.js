'use babel';

import {
    CompositeDisposable
} from 'atom'
import request from 'request'

export default {

    /* subscriptions, activate(), deactivate() */

    subscriptions: null,

    activate() {
        this.subscriptions = new CompositeDisposable()

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'ti-code-fetch:fetch': () => this.fetch()
        }))
    },

    deactivate() {
        this.subscriptions.dispose()
    },



    fetch() {
  let editor
  if (editor = atom.workspace.getActiveTextEditor()) {
    let selection = editor.getSelectedText()
    this.download('https://raw.githubusercontent.com/jasonkneen/ti-code-fetch/master/' + selection.replace(' ', '-') + ".js").then((response) => {
    atom.notifications.addSuccess('Found a template!')
      editor.insertText(response)
    }).catch((error) => {
      atom.notifications.addWarning(error.reason)
    })
  }
},

    download(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body)
                } else {
                    reject({
                        reason: 'Sorry, no code template available'
                    })
                }
            })
        })
    }
}
