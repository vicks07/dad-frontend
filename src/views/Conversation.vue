<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <v-card>
                    <v-card-title class="d-flex align-center">
                        <v-btn icon @click="$router.back()" class="mr-4">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <div>
                            <div class="text-h6">{{ otherUser.firstName }} {{ otherUser.lastName }}</div>
                            <div class="text-subtitle-2">{{ otherUser.bio }}</div>
                        </div>
                    </v-card-title>

                    <v-card-text class="chat-container" ref="chatContainer">
                        <div v-for="message in messages" :key="message._id" class="message-wrapper">
                            <div :class="['message', message.sender._id === currentUser._id ? 'sent' : 'received']">
                                <div class="message-content">{{ message.content }}</div>
                                <div class="message-time">{{ formatTime(message.createdAt) }}</div>
                            </div>
                        </div>
                    </v-card-text>

                    <v-card-actions class="message-input">
                        <v-text-field v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage"
                            hide-details dense></v-text-field>
                        <v-btn color="primary" icon @click="sendMessage" :disabled="!newMessage.trim()">
                            <v-icon>mdi-send</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { format } from 'date-fns';

export default {
    name: 'Conversation',
    data() {
        return {
            newMessage: '',
            messages: []
        };
    },
    computed: {
        ...mapState(['currentUser']),
        otherUser() {
            return this.messages[0]?.sender._id === this.currentUser._id
                ? this.messages[0]?.receiver
                : this.messages[0]?.sender;
        }
    },
    methods: {
        ...mapActions(['fetchMessages', 'sendMessage']),
        formatTime(date) {
            return format(new Date(date), 'h:mm a');
        },
        async loadMessages() {
            try {
                const userId = this.$route.params.id;
                this.messages = await this.fetchMessages(userId);
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        },
        async sendMessage() {
            if (!this.newMessage.trim()) return;

            try {
                await this.sendMessage({
                    receiverId: this.otherUser._id,
                    content: this.newMessage
                });
                this.newMessage = '';
                await this.loadMessages();
            } catch (error) {
                console.error('Error sending message:', error);
            }
        },
        scrollToBottom() {
            const container = this.$refs.chatContainer;
            container.scrollTop = container.scrollHeight;
        }
    },
    created() {
        this.loadMessages();
    }
};
</script>

<style scoped>
.chat-container {
    height: 400px;
    overflow-y: auto;
    padding: 16px;
}

.message-wrapper {
    margin-bottom: 16px;
}

.message {
    max-width: 70%;
    padding: 8px 12px;
    border-radius: 12px;
}

.sent {
    margin-left: auto;
    background-color: #E3F2FD;
}

.received {
    margin-right: auto;
    background-color: #F5F5F5;
}

.message-time {
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 4px;
}

.message-input {
    padding: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>