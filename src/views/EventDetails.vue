<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <v-card v-if="event">
                    <v-card-title class="text-h4">{{ event.title }}</v-card-title>
                    <v-card-subtitle>
                        {{ formatDate(event.date) }} at {{ event.time.start }}
                    </v-card-subtitle>

                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">
                                <h3 class="text-h6 mb-2">Location</h3>
                                <p>{{ event.location.venue }}</p>
                                <p>{{ event.location.address.street }}</p>
                                <p>
                                    {{ event.location.address.city }},
                                    {{ event.location.address.state }}
                                    {{ event.location.address.zipCode }}
                                </p>
                                <p>{{ event.location.address.country }}</p>
                            </v-col>

                            <v-col cols="12" md="6">
                                <h3 class="text-h6 mb-2">Details</h3>
                                <p><strong>Type:</strong> {{ event.type }}</p>
                                <p><strong>Capacity:</strong> {{ event.capacity }} people</p>
                                <p><strong>Price:</strong> ${{ event.price }}</p>
                                <p><strong>Organizer:</strong> {{ event.organizer.firstName }} {{
                                    event.organizer.lastName }}</p>
                            </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>

                        <h3 class="text-h6 mb-2">Description</h3>
                        <p>{{ event.description }}</p>

                        <v-divider class="my-4"></v-divider>

                        <h3 class="text-h6 mb-2">Requirements</h3>
                        <p><strong>Age Range:</strong> {{ event.requirements.ageRange.min }} - {{
                            event.requirements.ageRange.max }}</p>
                        <p><strong>Minimum Emotional Readiness:</strong> {{ event.requirements.emotionalReadinessMin
                            }}/10</p>

                        <v-divider class="my-4"></v-divider>

                        <h3 class="text-h6 mb-2">Participants ({{ event.registeredParticipants.length }}/{{
                            event.capacity }})</h3>
                        <v-list>
                            <v-list-item v-for="participant in event.registeredParticipants" :key="participant._id">
                                <v-list-item-title>
                                    {{ participant.firstName }} {{ participant.lastName }}
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="primary" :disabled="isRegistered || isFull" @click="registerForEvent">
                            {{ getRegisterButtonText }}
                        </v-btn>
                    </v-card-actions>
                </v-card>

                <v-progress-circular v-else indeterminate color="primary" class="ma-4"></v-progress-circular>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { format } from 'date-fns';

export default {
    name: 'EventDetails',
    data() {
        return {
            event: null
        };
    },
    computed: {
        ...mapState(['currentUser']),
        isRegistered() {
            return this.event?.registeredParticipants.some(
                p => p._id === this.currentUser?._id
            );
        },
        isFull() {
            return this.event?.registeredParticipants.length >= this.event?.capacity;
        },
        getRegisterButtonText() {
            if (this.isRegistered) return 'Already Registered';
            if (this.isFull) return 'Event Full';
            return 'Register for Event';
        }
    },
    methods: {
        ...mapActions(['fetchEvent', 'registerForEvent']),
        formatDate(date) {
            return format(new Date(date), 'MMMM d, yyyy');
        },
        async loadEvent() {
            try {
                const eventId = this.$route.params.id;
                this.event = await this.fetchEvent(eventId);
            } catch (error) {
                console.error('Error loading event:', error);
            }
        }
    },
    created() {
        this.loadEvent();
    }
};
</script>