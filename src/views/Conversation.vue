<template>
    <div class="conversation">
        <v-container :class="{ 'pa-0': $vuetify.display.smAndDown }">
            <!-- Header -->
            <v-card :class="{
                'mobile-card': $vuetify.display.smAndDown,
                'conversation-header': true
            }">
                <v-toolbar :class="{
                    'px-2': $vuetify.display.smAndDown,
                    'px-4': $vuetify.display.mdAndUp
                }" flat>
                    <v-btn icon variant="text" to="/messages" class="mr-2">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>

                    <v-avatar size="40" class="mr-3">
                        <v-img :src="participant.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"></v-img>
                    </v-avatar>

                    <v-toolbar-title class="d-flex align-center">
                        {{ participant.firstName }} {{ participant.lastName }}
                        <v-icon v-if="participant.verified" color="primary" size="small" class="ml-2">
                            mdi-check-decagram
                        </v-icon>
                    </v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon variant="text" :to="'/profile/' + participant._id">
                        <v-icon>mdi-account</v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card>

            <!-- Messages -->
            <div ref="messagesContainer" class="messages-container"
                :class="{ 'mobile-messages': $vuetify.display.smAndDown }">
                <v-card :class="{
                    'mobile-card': $vuetify.display.smAndDown,
                    'messages-card': true
                }">
                    <!-- Loading State -->
                    <div v-if="loading" class="d-flex justify-center align-center pa-4">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>

                    <!-- Empty State -->
                    <v-card-text v-else-if="messages.length === 0" class="text-center pa-8">
                        <v-icon size="64" color="grey">mdi-message-outline</v-icon>
                        <h3 class="mt-4 text-h6">No Messages Yet</h3>
                        <p class="text-body-2 text-grey">
                            Start the conversation by sending a message below
                        </p>
                    </v-card-text>

                    <!-- Messages List -->
                    <v-list v-else class="messages-list pa-4">
                        <div v-for="(message, index) in messages" :key="message._id" class="message-wrapper" :class="{
                            'mb-4': !isConsecutive(index),
                            'mb-1': isConsecutive(index)
                        }">
                            <!-- Date Separator -->
                            <div v-if="showDateSeparator(index)" class="date-separator text-center my-4">
                                <span class="text-caption text-grey px-2 bg-surface">
                                    {{ formatDate(message.timestamp, 'full') }}
                                </span>
                            </div>

                            <!-- Message Bubble -->
                            <div class="message d-flex" :class="{
                                'justify-end': message.sender === currentUser._id,
                                'justify-start': message.sender !== currentUser._id
                            }">
                                <v-avatar v-if="!isConsecutive(index) && message.sender !== currentUser._id" size="32"
                                    class="mr-2 mt-1">
                                    <v-img
                                        :src="participant.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"></v-img>
                                </v-avatar>
                                <div v-else-if="message.sender !== currentUser._id" class="ml-10"></div>

                                <div class="message-bubble pa-2" :class="{
                                    'sent': message.sender === currentUser._id,
                                    'received': message.sender !== currentUser._id,
                                    'rounded-lg': !isConsecutive(index),
                                    'consecutive': isConsecutive(index)
                                }">
                                    <div class="message-text text-body-2">{{ message.content }}</div>
                                    <div class="message-time d-flex align-center">
                                        <span class="text-caption">
                                            {{ formatDate(message.timestamp, 'time') }}
                                        </span>
                                        <v-icon v-if="message.sender === currentUser._id" size="small"
                                            :color="message.read ? 'success' : 'grey'" class="ml-1">
                                            {{ message.read ? 'mdi-check-all' : 'mdi-check' }}
                                        </v-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-list>
                </v-card>
            </div>

            <!-- Message Input -->
            <v-card :class="{
                'mobile-card': $vuetify.display.smAndDown,
                'message-input': true
            }">
                <v-form @submit.prevent="sendMessage" class="d-flex align-center pa-2">
                    <v-text-field v-model="newMessage" placeholder="Type a message..." variant="outlined"
                        density="comfortable" hide-details class="mr-2"
                        @keydown.enter.prevent="sendMessage"></v-text-field>
                    <v-btn color="primary" icon :disabled="!newMessage.trim()" @click="sendMessage">
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-form>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'

export default {
    name: 'Conversation',

    setup() {
        const store = useStore()
        const route = useRoute()
        const messagesContainer = ref(null)
        const loading = ref(true)
        const messages = ref([])
        const newMessage = ref('')
        const participant = ref({})
        const socket = ref(null)

        const currentUser = computed(() => store.state.auth.user)

        const isConsecutive = (index) => {
            if (index === 0) return false
            const currentMessage = messages.value[index]
            const previousMessage = messages.value[index - 1]
            return currentMessage.sender === previousMessage.sender &&
                new Date(currentMessage.timestamp) - new Date(previousMessage.timestamp) < 300000 // 5 minutes
        }

        const showDateSeparator = (index) => {
            if (index === 0) return true
            const currentMessage = messages.value[index]
            const previousMessage = messages.value[index - 1]
            return !isSameDay(new Date(currentMessage.timestamp), new Date(previousMessage.timestamp))
        }

        const isSameDay = (date1, date2) => {
            return date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
        }

        const formatDate = (timestamp, format = 'time') => {
            const date = new Date(timestamp)
            const now = new Date()

            if (format === 'time') {
                return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                })
            }

            if (format === 'full') {
                if (isSameDay(date, now)) {
                    return 'Today'
                }

                if (isSameDay(date, new Date(now.setDate(now.getDate() - 1)))) {
                    return 'Yesterday'
                }

                if (now - date < 7 * 24 * 60 * 60 * 1000) {
                    return date.toLocaleDateString('en-US', { weekday: 'long' })
                }

                return date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })
            }
        }

        const scrollToBottom = () => {
            nextTick(() => {
                if (messagesContainer.value) {
                    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
                }
            })
        }

        const sendMessage = async () => {
            if (!newMessage.value.trim()) return

            const message = {
                content: newMessage.value,
                sender: currentUser.value._id,
                receiver: participant.value._id,
                timestamp: new Date().toISOString(),
                read: false
            }

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.state.auth.token}`
                    },
                    body: JSON.stringify(message)
                })

                if (!response.ok) throw new Error('Failed to send message')

                const sentMessage = await response.json()
                messages.value.push(sentMessage)
                newMessage.value = ''
                scrollToBottom()

                // Emit message through socket
                if (socket.value) {
                    socket.value.emit('message', sentMessage)
                }
            } catch (error) {
                console.error('Error sending message:', error)
            }
        }

        // Load conversation data
        onMounted(async () => {
            try {
                // Load participant info
                const participantResponse = await fetch(`/api/users/${route.params.id}`)
                participant.value = await participantResponse.json()

                // Load messages
                const messagesResponse = await fetch(`/api/messages/${route.params.id}`)
                messages.value = await messagesResponse.json()

                // Mark messages as read
                const unreadMessages = messages.value
                    .filter(m => m.sender === participant.value._id && !m.read)
                    .map(m => m._id)

                if (unreadMessages.length > 0) {
                    await fetch('/api/messages/read', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${store.state.auth.token}`
                        },
                        body: JSON.stringify({ messageIds: unreadMessages })
                    })
                }

                // Connect to socket
                socket.value = io(process.env.VUE_APP_SOCKET_URL)
                socket.value.on('message', (message) => {
                    if (message.sender === participant.value._id) {
                        messages.value.push(message)
                        scrollToBottom()
                    }
                })

                loading.value = false
                scrollToBottom()
            } catch (error) {
                console.error('Error loading conversation:', error)
                loading.value = false
            }
        })

        onBeforeUnmount(() => {
            if (socket.value) {
                socket.value.disconnect()
            }
        })

        return {
            messagesContainer,
            loading,
            messages,
            newMessage,
            participant,
            currentUser,
            isConsecutive,
            showDateSeparator,
            formatDate,
            sendMessage
        }
    }
}
</script>

<style scoped>
.conversation {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.conversation-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.messages-container {
    flex: 1;
    overflow-y: auto;
    margin-top: 64px;
    margin-bottom: 72px;
    padding: 1rem;
}

.messages-card {
    background-color: transparent;
    box-shadow: none;
}

.message-wrapper {
    position: relative;
}

.date-separator {
    position: relative;
    text-align: center;
}

.date-separator::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.12);
    z-index: -1;
}

.message-bubble {
    max-width: 80%;
    position: relative;
}

.message-bubble.sent {
    background-color: rgb(var(--v-theme-primary));
    color: white;
    border-radius: 16px 4px 16px 16px;
}

.message-bubble.received {
    background-color: rgb(var(--v-theme-surface));
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px 16px 16px 16px;
}

.message-bubble.consecutive.sent {
    border-radius: 16px 4px 16px 16px;
    margin-top: 2px;
}

.message-bubble.consecutive.received {
    border-radius: 4px 16px 16px 16px;
    margin-top: 2px;
}

.message-time {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: 2px;
    justify-content: flex-end;
}

.message-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

@media (max-width: 600px) {
    .mobile-card {
        border-radius: 0;
        margin: 0;
        box-shadow: none;
    }

    .mobile-messages {
        padding: 0;
    }

    .conversation-header {
        margin-top: 0;
    }

    .messages-container {
        margin-top: 56px;
        margin-bottom: 64px;
    }

    .message-bubble {
        max-width: 85%;
    }

    .message-input .v-form {
        padding: 8px;
    }
}
</style>