<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <h1 class="text-h4 mb-6">Subscription Plans</h1>

                <v-row>
                    <v-col cols="12" md="6">
                        <v-card>
                            <v-card-title class="text-h5">Basic Plan</v-card-title>
                            <v-card-text>
                                <div class="text-h4 mb-4">Free</div>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="success">mdi-check</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Basic Profile</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="success">mdi-check</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Limited Matches</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="success">mdi-check</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Basic Events Access</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn block color="primary" :disabled="currentPlan === 'basic'">
                                    Current Plan
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card>
                            <v-card-title class="text-h5">Premium Plan</v-card-title>
                            <v-card-text>
                                <div class="text-h4 mb-4">$29.99/month</div>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="success">mdi-check</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Enhanced Profile</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="success">mdi-check</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Unlimited Matches</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="success">mdi-check</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Priority Event Access</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="success">mdi-check</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>Advanced Matching Algorithm</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn block color="primary" @click="upgradeToPremium" :loading="loading"
                                    :disabled="currentPlan === 'premium'">
                                    {{ currentPlan === 'premium' ? 'Current Plan' : 'Upgrade to Premium' }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Subscription',
    data() {
        return {
            loading: false
        };
    },
    computed: {
        ...mapState(['currentUser']),
        currentPlan() {
            return this.currentUser?.subscription?.plan || 'basic';
        }
    },
    methods: {
        ...mapActions(['createCheckoutSession']),
        async upgradeToPremium() {
            this.loading = true;
            try {
                const session = await this.createCheckoutSession();
                window.location.href = session.url;
            } catch (error) {
                console.error('Error creating checkout session:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>