let messageCounts = {};
const spamThreshold = 10;
const spamInterval = 60000;

module.exports.config = {
		name: "spamleave",
		version: "1.0.0",
};

module.exports.run = function({ api, event, args }) {
		api.sendMessage("This command functionality when the user spamming on group chats", event.threadID, event.messageID);
};

module.exports.handleEvent = function({ api, event }) {
		const { threadID, messageID, senderID } = event;

		if (!messageCounts[threadID]) {
				messageCounts[threadID] = {};
		}

		if (!messageCounts[threadID][senderID]) {
				messageCounts[threadID][senderID] = {
						count: 1,
						timer: setTimeout(() => {
								delete messageCounts[threadID][senderID];
						}, spamInterval)
				};
		} else {
				messageCounts[threadID][senderID].count++;
				if (messageCounts[threadID][senderID].count > spamThreshold) {
						api.sendMessage("🛡️ | Detected spamming. The bot will be left from the group", threadID, messageID);
						api.removeUserFromGroup(senderID, threadID);
				}
		}
};
