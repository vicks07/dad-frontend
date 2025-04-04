<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <v-card class="mb-6">
                    <v-card-title class="text-h4 text-center py-6">
                        Welcome to Discovery After Divorce
                    </v-card-title>
                    <v-card-text class="text-center">
                        <p class="text-body-1 mb-4">
                            A safe space for new beginnings. Connect with others who understand your journey.
                        </p>
                        <v-btn v-if="!isAuthenticated" color="primary" size="large" to="/login" class="mr-4">
                            Get Started
                        </v-btn>
                        <v-btn v-if="!isAuthenticated" color="secondary" size="large" to="/register">
                            Create Account
                        </v-btn>
                    </v-card-text>
                </v-card>

                <v-row>
                    <v-col cols="12" md="4">
                        <v-card>
                            <v-card-title>Upcoming Events</v-card-title>
                            <v-card-text>
                                <v-list v-if="upcomingEvents.length">
                                    <v-list-item v-for="event in upcomingEvents" :key="event._id"
                                        :to="'/events/' + event._id">
                                        <v-list-item-title>{{ event.title }}</v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ formatDate(event.date) }}
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                                <p v-else>No upcoming events</p>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-card>
                            <v-card-title>New Matches</v-card-title>
                            <v-card-text>
                                <v-list v-if="newMatches.length">
                                    <v-list-item v-for="match in newMatches" :key="match.user._id"
                                        :to="'/matches/' + match.user._id">
                                        <v-list-item-title>
                                            {{ match.user.firstName }} {{ match.user.lastName }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ match.status }}
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                                <p v-else>No new matches</p>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-card>
                            <v-card-title>Recent Messages</v-card-title>
                            <v-card-text>
                                <v-list v-if="recentMessages.length">
                                    <v-list-item v-for="message in recentMessages" :key="message._id"
                                        :to="'/messages/' + message.sender._id">
                                        <v-list-item-title>
                                            {{ message.sender.firstName }} {{ message.sender.lastName }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ message.content }}
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                                <p v-else>No recent messages</p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { format } from 'date-fns';

export default {
    name: 'Home',
    data() {
        return {
            upcomingEvents: [],
            newMatches: [],
            recentMessages: []
        };
    },
    computed: {
        ...mapState(['isAuthenticated'])
    },
    methods: {
        ...mapActions(['fetchEvents', 'fetchMatches', 'fetchMessages']),
        formatDate(date) {
            return format(new Date(date), 'MMM d, yyyy');
        },
        async loadData() {
            if (this.isAuthenticated) {
                try {
                    const [events, matches, messages] = await Promise.all([
                        this.fetchEvents(),
                        this.fetchMatches(),
                        this.fetchMessages()
                    ]);

                    this.upcomingEvents = events.slice(0, 5);
                    this.newMatches = matches.slice(0, 5);
                    this.recentMessages = messages.slice(0, 5);
                } catch (error) {
                    console.error('Error loading data:', error);
                }
            }
        }
    },
    created() {
        this.loadData();
    }
};
</script>