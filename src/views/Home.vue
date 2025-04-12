<template>
    <div class="home">
        <v-container :class="{ 'pa-0': $vuetify.display.smAndDown }">
            <!-- Welcome Section -->
            <v-row>
                <v-col cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-6': $vuetify.display.mdAndUp,
                        'pa-4': $vuetify.display.smAndDown
                    }">
                        <v-card-title class="text-h4 mb-4">
                            Welcome{{ user ? ', ' + user.firstName : '' }}!
                        </v-card-title>
                        <v-card-text>
                            <p class="text-body-1">
                                Start your journey of discovery and healing. Connect with others who understand your
                                path.
                            </p>
                        </v-card-text>
                        <v-card-actions v-if="!isAuthenticated">
                            <v-btn color="primary" block :size="$vuetify.display.smAndDown ? 'large' : 'default'"
                                to="/register">
                                Get Started
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Dashboard Sections for Authenticated Users -->
            <template v-if="isAuthenticated">
                <!-- Upcoming Events -->
                <v-row class="mt-4">
                    <v-col cols="12" md="6">
                        <v-card :class="{
                            'mobile-card': $vuetify.display.smAndDown,
                            'pa-4': true
                        }">
                            <v-card-title class="d-flex align-center">
                                <v-icon start color="primary" class="mr-2">mdi-calendar</v-icon>
                                Upcoming Events
                                <v-spacer></v-spacer>
                                <v-btn variant="text" color="primary" to="/events"
                                    :size="$vuetify.display.smAndDown ? 'small' : 'default'">
                                    View All
                                </v-btn>
                            </v-card-title>

                            <v-list v-if="upcomingEvents.length" class="pa-0">
                                <v-list-item v-for="event in upcomingEvents" :key="event._id"
                                    :to="'/events/' + event._id" class="touch-target">
                                    <template v-slot:prepend>
                                        <v-avatar :color="event.type === 'workshop' ? 'info' : 'success'" size="42">
                                            <v-icon>{{ event.type === 'workshop' ? 'mdi-school' : 'mdi-account-group'
                                                }}</v-icon>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-title class="font-weight-medium">
                                        {{ event.title }}
                                    </v-list-item-title>

                                    <v-list-item-subtitle>
                                        {{ formatDate(event.date) }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </v-list>

                            <v-card-text v-else class="text-center pa-4">
                                <v-icon size="48" color="grey">mdi-calendar-blank</v-icon>
                                <div class="mt-2">No upcoming events</div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <!-- New Matches -->
                    <v-col cols="12" md="6">
                        <v-card :class="{
                            'mobile-card': $vuetify.display.smAndDown,
                            'pa-4': true
                        }">
                            <v-card-title class="d-flex align-center">
                                <v-icon start color="error" class="mr-2">mdi-heart</v-icon>
                                New Matches
                                <v-spacer></v-spacer>
                                <v-btn variant="text" color="primary" to="/matches"
                                    :size="$vuetify.display.smAndDown ? 'small' : 'default'">
                                    View All
                                </v-btn>
                            </v-card-title>

                            <v-list v-if="newMatches.length" class="pa-0">
                                <v-list-item v-for="match in newMatches" :key="match._id" :to="'/matches/' + match._id"
                                    class="touch-target">
                                    <template v-slot:prepend>
                                        <v-avatar size="42">
                                            <v-img
                                                :src="match.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"></v-img>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-title class="font-weight-medium">
                                        {{ match.firstName }} {{ match.lastName }}
                                    </v-list-item-title>

                                    <v-list-item-subtitle>
                                        {{ match.age }} years • {{ match.location }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </v-list>

                            <v-card-text v-else class="text-center pa-4">
                                <v-icon size="48" color="grey">mdi-heart-outline</v-icon>
                                <div class="mt-2">No new matches</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Recent Messages -->
                <v-row class="mt-4">
                    <v-col cols="12">
                        <v-card :class="{
                            'mobile-card': $vuetify.display.smAndDown,
                            'pa-4': true
                        }">
                            <v-card-title class="d-flex align-center">
                                <v-icon start color="info" class="mr-2">mdi-message</v-icon>
                                Recent Messages
                                <v-spacer></v-spacer>
                                <v-btn variant="text" color="primary" to="/messages"
                                    :size="$vuetify.display.smAndDown ? 'small' : 'default'">
                                    View All
                                </v-btn>
                            </v-card-title>

                            <v-list v-if="recentMessages.length" class="pa-0">
                                <v-list-item v-for="message in recentMessages" :key="message._id"
                                    :to="'/messages/' + message.conversationId" class="touch-target">
                                    <template v-slot:prepend>
                                        <v-avatar size="42">
                                            <v-img
                                                :src="message.sender.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"></v-img>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-title class="font-weight-medium">
                                        {{ message.sender.firstName }} {{ message.sender.lastName }}
                                    </v-list-item-title>

                                    <v-list-item-subtitle class="text-truncate">
                                        {{ message.content }}
                                    </v-list-item-subtitle>

                                    <template v-slot:append>
                                        <v-chip v-if="!message.read" color="primary" size="small" class="ml-2">
                                            New
                                        </v-chip>
                                    </template>
                                </v-list-item>
                            </v-list>

                            <v-card-text v-else class="text-center pa-4">
                                <v-icon size="48" color="grey">mdi-message-outline</v-icon>
                                <div class="mt-2">No recent messages</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
        </v-container>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Home',

    setup() {
        const store = useStore()
        const upcomingEvents = ref([])
        const newMatches = ref([])
        const recentMessages = ref([])

        const user = computed(() => store.state.auth.user)
        const isAuthenticated = computed(() => store.state.auth.isAuthenticated)

        const loadData = async () => {
            if (isAuthenticated.value) {
                try {
                    // Load upcoming events
                    const eventsResponse = await fetch('/api/events/upcoming')
                    upcomingEvents.value = await eventsResponse.json()

                    // Load new matches
                    const matchesResponse = await fetch('/api/matches/new')
                    newMatches.value = await matchesResponse.json()

                    // Load recent messages
                    const messagesResponse = await fetch('/api/messages/recent')
                    recentMessages.value = await messagesResponse.json()
                } catch (error) {
                    console.error('Error loading data:', error)
                }
            }
        }

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            })
        }

        onMounted(() => {
            loadData()
        })

        return {
            user,
            isAuthenticated,
            upcomingEvents,
            newMatches,
            recentMessages,
            formatDate
        }
    }
}
</script>

<style scoped>
.home {
    min-height: 100vh;
}

.v-card {
    transition: transform 0.2s;
}

.v-card:hover {
    transform: translateY(-2px);
}

.v-list-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-list-item:last-child {
    border-bottom: none;
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

    .v-card-title {
        font-size: 1.25rem !important;
    }
}
</style>