const { Signale } = require('signale')

const signale = new Signale({
    config: {
        underlineLabel: false
    },
    types: {
        cli: {
            badge: '🛠',
            color: 'green',
            label: 'name'
        },
        version: {
            badge: '📜',
            color: 'yellow',
            label: 'version'
        }
    }
})

const httpLog = new Signale({
    config: {
        displayTimestamp: true,
    },
    types: {
        get: {
            badge: 'GET',
            color: 'green',
            label: ''
        },
        post: {
            badge: 'POST',
            color: 'blue',
            label: ''
        }
    }
})

// 交互式记录
const interactive = new Signale({
	interactive: true,
	config: {
		underlineLabel: false
	}
})

module.exports = {
    signale,
    interactive,
    httpLog
}