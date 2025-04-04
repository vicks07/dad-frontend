<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 mb-6">Upcoming Events</h1>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="3">
                <v-card class="mb-4">
                    <v-card-title>Filters</v-card-title>
                    <v-card-text>
                        <v-select v-model="filters.type" :items="eventTypes" label="Event Type" clearable></v-select>

                        <v-select v-model="filters.location" :items="locations" label="Location" clearable></v-select>

                        <v-range-slider v-model="filters.price" :min="0" :max="100" :step="10" label="Price Range"
                            thumb-label></v-range-slider>

                        <v-checkbox v-model="filters.showPremium" label="Show Premium Events"></v-checkbox>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="9">
                <v-row>
                    <v-col v-for="event in filteredEvents" :key="event._id" cols="12" sm="6" lg="4">
                        <v-card :class="{ 'premium-event': event.isPremium }" @click="viewEventDetails(event._id)">
                            <v-img :src="getEventImage(event.type)" height="200" class="align-end">
                                <v-chip v-if="event.isPremium" color="amber" class="ma-2" small>
                                    Premium
                                </v-chip>
                            </v-img>

                            <v-card-title>{{ event.title }}</v-card-title>

                            <v-card-text>
                                <div class="d-flex align-center mb-2">
                                    <v-icon small class="mr-1">mdi-calendar</v-icon>
                                    {{ formatDate(event.date) }}
                                </div>
                                <div class="d-flex align-center mb-2">
                                    <v-icon small class="mr-1">mdi-clock</v-icon>
                                    {{ event.time.start }} - {{ event.time.end }}
                                </div>
                                <div class="d-flex align-center mb-2">
                                    <v-icon small class="mr-1">mdi-map-marker</v-icon>
                                    {{ event.location.venue }}
                                </div>
                                <div class="d-flex align-center">
                                    <v-icon small class="mr-1">mdi-currency-usd</v-icon>
                                    {{ event.price === 0 ? 'Free' : `$${event.price}` }}
                                </div>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click.stop="registerForEvent(event)"
                                    :disabled="event.registeredParticipants.includes(currentUser._id)">
                                    {{ event.registeredParticipants.includes(currentUser._id)
                                        ? 'Registered'
                                    : 'Register' }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
            {{ snackbarText }}
        </v-snackbar>
    </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'

export default {
    name: 'Events',
    setup() {
        const store = useStore()
        const router = useRouter()
        const snackbar = ref(false)
        const snackbarText = ref('')
        const snackbarColor = ref('error')

        const filters = ref({
            type: null,
            location: null,
            price: [0, 100],
            showPremium: false
        })

        const eventTypes = [
            'cuddle-cafe',
            'game-night',
            'workshop',
            'social-mixer',
            'therapy-group'
        ]

        const locations = [
            'New York',
            'Los Angeles',
            'Chicago',
            'Houston',
            'Phoenix'
        ]

        const events = computed(() => store.getters.events)
        const currentUser = computed(() => store.getters.currentUser)
        const loading = computed(() => store.getters.loading)

        const filteredEvents = computed(() => {
            return events.value.filter(event => {
                if (filters.value.type && event.type !== filters.value.type) return false
                if (filters.value.location && !event.location.city.includes(filters.value.location)) return false
                if (event.price < filters.value.price[0] || event.price > filters.value.price[1]) return false
                if (!filters.value.showPremium && event.isPremium) return false
                return true
            })
        })

        const getEventImage = (type) => {
            const images = {
                'cuddle-cafe': 'https://source.unsplash.com/random/400x300/?cafe',
                'game-night': 'https://source.unsplash.com/random/400x300/?boardgame',
                'workshop': 'https://source.unsplash.com/random/400x300/?workshop',
                'social-mixer': 'https://source.unsplash.com/random/400x300/?party',
                'therapy-group': 'https://source.unsplash.com/random/400x300/?therapy'
            }
            return images[type] || 'https://source.unsplash.com/random/400x300/?event'
        }

        const formatDate = (date) => {
            return format(new Date(date), 'MMMM d, yyyy')
        }

        const viewEventDetails = (eventId) => {
            router.push(`/events/${eventId}`)
        }

        const registerForEvent = async (event) => {
            try {
                await store.dispatch('registerForEvent', event._id)
                snackbarColor.value = 'success'
                snackbarText.value = 'Successfully registered for event!'
                snackbar.value = true
            } catch (error) {
                snackbarColor.value = 'error'
                snackbarText.value = error.message || 'Failed to register for event'
                snackbar.value = true
            }
        }

        onMounted(async () => {
            try {
                await store.dispatch('fetchEvents')
            } catch (error) {
                snackbarColor.value = 'error'
                snackbarText.value = 'Failed to load events'
                snackbar.value = true
            }
        })

        return {
            filters,
            eventTypes,
            locations,
            filteredEvents,
            currentUser,
            loading,
            snackbar,
            snackbarText,
            snackbarColor,
            getEventImage,
            formatDate,
            viewEventDetails,
            registerForEvent
        }
    }
}
</script>

<style scoped>
.premium-event {
    border: 2px solid var(--v-amber-base);
}

.v-card {
    transition: transform 0.2s;
}

.v-card:hover {
    transform: translateY(-4px);
    cursor: pointer;
}

.v-card-text {
    padding: 16px;
}

.v-btn {
    text-transform: none;
    letter-spacing: 0.5px;
}
</style>