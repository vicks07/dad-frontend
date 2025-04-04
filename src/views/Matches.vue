<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <h1 class="text-h4 mb-6">Your Matches</h1>

                <v-tabs v-model="activeTab">
                    <v-tab value="pending">Pending</v-tab>
                    <v-tab value="accepted">Accepted</v-tab>
                    <v-tab value="rejected">Rejected</v-tab>
                </v-tabs>

                <v-window v-model="activeTab">
                    <v-window-item value="pending">
                        <v-card class="mt-4">
                            <v-list>
                                <v-list-item v-for="match in pendingMatches" :key="match.user._id">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ match.user.firstName }} {{ match.user.lastName }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ match.user.bio }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-btn color="success" class="mr-2"
                                            @click="updateMatchStatus(match.user._id, 'accepted')">
                                            Accept
                                        </v-btn>
                                        <v-btn color="error" @click="updateMatchStatus(match.user._id, 'rejected')">
                                            Reject
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="accepted">
                        <v-card class="mt-4">
                            <v-list>
                                <v-list-item v-for="match in acceptedMatches" :key="match.user._id"
                                    :to="'/messages/' + match.user._id">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ match.user.firstName }} {{ match.user.lastName }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ match.user.bio }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-btn color="primary" @click="startConversation(match.user._id)">
                                            Message
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="rejected">
                        <v-card class="mt-4">
                            <v-list>
                                <v-list-item v-for="match in rejectedMatches" :key="match.user._id">
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ match.user.firstName }} {{ match.user.lastName }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ match.user.bio }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-window-item>
                </v-window>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Matches',
    data() {
        return {
            activeTab: 'pending'
        };
    },
    computed: {
        ...mapState(['matches']),
        pendingMatches() {
            return this.matches.filter(match => match.status === 'pending');
        },
        acceptedMatches() {
            return this.matches.filter(match => match.status === 'accepted');
        },
        rejectedMatches() {
            return this.matches.filter(match => match.status === 'rejected');
        }
    },
    methods: {
        ...mapActions(['fetchMatches', 'updateMatch']),
        async updateMatchStatus(userId, status) {
            try {
                await this.updateMatch({ userId, status });
                await this.fetchMatches();
            } catch (error) {
                console.error('Error updating match:', error);
            }
        },
        startConversation(userId) {
            this.$router.push(`/messages/${userId}`);
        }
    },
    created() {
        this.fetchMatches();
    }
};
</script>