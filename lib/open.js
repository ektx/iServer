/*
  open.js
  -------------------------------------------
  在浏览器中打开网址
*/

var exec = require('child_process').exec
  , path = require('path')
  ;


/**
 * 说明
 *
 * @target [string] 要找开的网址
 * @appName [''| iexplore | chrome | firefox | oprea] ''空时,默认浏览器
 *
 * 参考
 * https://github.com/pwnall/node-open
 */

module.exports = open;

function open(target, appName) {
    var opener;

    switch (process.platform) {
        case 'darwin':
            if (appName) {
                opener = 'open -a "' + escape(appName) + '"';
            } else {
                opener = 'open';
            }
            break;
        case 'win32':
            // if the first parameter to start is quoted, it uses that as the title
            // so we pass a blank title so we can quote the file we are opening
            if (appName) {
                opener = 'start "" "' + escape(appName) + '"';
            } else {
                opener = 'start ""';
            }
            break;
        default:
            if (appName) {
                opener = escape(appName);
            } else {
                // use Portlands xdg-open everywhere else
                opener = path.join(__dirname, '../vendor/xdg-open');
            }
            break;
    }

    if (process.env.SUDO_USER) {
        opener = 'sudo -u ' + process.env.SUDO_USER + ' ' + opener;
    }
    return exec(opener + ' "' + escape(target) + '"');
}

function escape(s) {
    return s.replace(/"/g, '\\\"');
}
