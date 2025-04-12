<template>
    <div class="messages">
        <v-container :class="{ 'pa-0': $vuetify.display.smAndDown }">
            <!-- Header Section -->
            <v-row>
                <v-col cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-6': $vuetify.display.mdAndUp,
                        'pa-4': $vuetify.display.smAndDown
                    }">
                        <v-card-title class="px-0">
                            <v-icon start color="info" class="mr-2">mdi-message</v-icon>
                            Messages
                        </v-card-title>
                        <v-card-subtitle class="px-0">
                            Stay connected with your matches
                        </v-card-subtitle>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Search and Filter -->
            <v-row class="mt-4">
                <v-col cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-4': true
                    }">
                        <v-text-field v-model="search" label="Search conversations" prepend-inner-icon="mdi-magnify"
                            variant="outlined" density="comfortable" hide-details></v-text-field>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Conversations List -->
            <v-row class="mt-4">
                <v-col cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'conversation-list': true
                    }">
                        <v-list v-if="filteredConversations.length" class="pa-0">
                            <v-list-item v-for="conversation in filteredConversations" :key="conversation._id"
                                :to="'/messages/' + conversation._id" :active="conversation._id === activeConversation"
                                class="conversation-item">
                                <template v-slot:prepend>
                                    <v-badge :content="conversation.unreadCount"
                                        :model-value="conversation.unreadCount > 0" color="error"
                                        class="conversation-badge">
                                        <v-avatar size="48">
                                            <v-img
                                                :src="conversation.participant.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"></v-img>
                                        </v-avatar>
                                    </v-badge>
                                </template>

                                <v-list-item-title class="font-weight-medium d-flex align-center">
                                    {{ conversation.participant.firstName }} {{ conversation.participant.lastName }}
                                    <v-icon v-if="conversation.participant.verified" color="primary" size="small"
                                        class="ml-2">
                                        mdi-check-decagram
                                    </v-icon>
                                </v-list-item-title>

                                <v-list-item-subtitle class="text-truncate">
                                    {{ conversation.lastMessage.content }}
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                    <div class="d-flex flex-column align-end">
                                        <span class="text-caption text-grey">
                                            {{ formatDate(conversation.lastMessage.timestamp) }}
                                        </span>
                                        <v-icon v-if="conversation.lastMessage.sender === currentUser._id" size="small"
                                            :color="conversation.lastMessage.read ? 'success' : 'grey'" class="mt-1">
                                            {{ conversation.lastMessage.read ? 'mdi-check-all' : 'mdi-check' }}
                                        </v-icon>
                                    </div>
                                </template>
                            </v-list-item>
                        </v-list>

                        <!-- Empty State -->
                        <v-card-text v-else class="text-center pa-8">
                            <v-icon size="64" color="grey">mdi-message-outline</v-icon>
                            <h3 class="mt-4 text-h6">No Messages Yet</h3>
                            <p class="text-body-2 text-grey">
                                {{ search ? 'No conversations match your search' : 'Start connecting with your matches'
                                }}
                            </p>
                            <v-btn color="primary" class="mt-4" to="/matches">
                                Find Matches
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
    name: 'Messages',

    setup() {
        const store = useStore()
        const route = useRoute()
        const search = ref('')
        const conversations = ref([])

        const currentUser = computed(() => store.state.auth.user)
        const activeConversation = computed(() => route.params.id)

        const filteredConversations = computed(() => {
            if (!search.value) return conversations.value

            const searchLower = search.value.toLowerCase()
            return conversations.value.filter(conversation =>
                `${conversation.participant.firstName} ${conversation.participant.lastName}`
                    .toLowerCase()
                    .includes(searchLower) ||
                conversation.lastMessage.content.toLowerCase().includes(searchLower)
            )
        })

        const formatDate = (timestamp) => {
            const date = new Date(timestamp)
            const now = new Date()
            const diff = now - date

            // If less than 24 hours ago, show time
            if (diff < 24 * 60 * 60 * 1000) {
                return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                })
            }

            // If less than 7 days ago, show day name
            if (diff < 7 * 24 * 60 * 60 * 1000) {
                return date.toLocaleDateString('en-US', { weekday: 'short' })
            }

            // Otherwise show date
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        }

        // Load conversations on mount
        fetch('/api/messages/conversations')
            .then(res => res.json())
            .then(data => {
                conversations.value = data
            })
            .catch(error => {
                console.error('Error loading conversations:', error)
            })

        return {
            search,
            conversations,
            currentUser,
            activeConversation,
            filteredConversations,
            formatDate
        }
    }
}
</script>

<style scoped>
.messages {
    min-height: 100vh;
}

.conversation-list {
    border-radius: 8px;
    overflow: hidden;
}

.conversation-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: background-color 0.2s;
}

.conversation-item:last-child {
    border-bottom: none;
}

.conversation-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
}

.conversation-item.v-list-item--active {
    background-color: rgb(var(--v-theme-primary-lighten-4));
}

.conversation-badge {
    margin: 4px;
}

@media (max-width: 600px) {
    .mobile-card {
        border-radius: 0;
        margin: 0 0 1rem 0;
        box-shadow: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .mobile-card:last-child {
        margin-bottom: 0;
        border-bottom: none;
    }

    .conversation-list {
        border-radius: 0;
    }

    .conversation-item {
        padding: 12px;
    }

    .v-list-item__prepend {
        padding-right: 12px;
    }

    .v-list-item__append {
        padding-left: 12px;
    }
}
</style>