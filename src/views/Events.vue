<template>
    <div class="events">
        <v-container :class="{ 'pa-0': $vuetify.display.smAndDown }">
            <!-- Header Section -->
            <v-row>
                <v-col cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-6': $vuetify.display.mdAndUp,
                        'pa-4': $vuetify.display.smAndDown
                    }">
                        <v-row align="center">
                            <v-col cols="12" sm="8">
                                <v-card-title class="px-0">
                                    <v-icon start color="primary" class="mr-2">mdi-calendar-month</v-icon>
                                    Events
                                </v-card-title>
                                <v-card-subtitle class="px-0">
                                    Discover workshops, support groups, and social gatherings
                                </v-card-subtitle>
                            </v-col>
                            <v-col cols="12" sm="4" class="text-sm-right">
                                <v-btn color="primary" prepend-icon="mdi-plus" :block="$vuetify.display.smAndDown"
                                    @click="showCreateDialog = true">
                                    Create Event
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Filters Section -->
            <v-row class="mt-4">
                <v-col cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-4': true
                    }">
                        <v-row>
                            <v-col cols="12" sm="4">
                                <v-text-field v-model="search" label="Search events" prepend-inner-icon="mdi-magnify"
                                    variant="outlined" density="comfortable" hide-details
                                    class="mb-4 mb-sm-0"></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <v-select v-model="selectedType" :items="eventTypes" label="Event Type"
                                    variant="outlined" density="comfortable" hide-details></v-select>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <v-select v-model="selectedSort" :items="sortOptions" label="Sort By" variant="outlined"
                                    density="comfortable" hide-details></v-select>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Events Grid -->
            <v-row class="mt-4">
                <v-col v-for="event in filteredEvents" :key="event._id" cols="12" sm="6" md="4" lg="3">
                    <v-card :to="'/events/' + event._id" :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'event-card': true
                    }" :ripple="true">
                        <v-img :src="event.image || 'https://picsum.photos/350/200'" height="200" cover
                            class="event-image">
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>

                        <v-card-title class="pt-4 px-4">
                            {{ event.title }}
                        </v-card-title>

                        <v-card-subtitle class="px-4">
                            <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                            {{ formatDate(event.date) }}
                        </v-card-subtitle>

                        <v-card-text class="px-4">
                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" color="primary" class="mr-1">
                                    {{ event.type === 'workshop' ? 'mdi-school' : 'mdi-account-group' }}
                                </v-icon>
                                <span class="text-caption text-primary">{{ event.type }}</span>
                                <v-spacer></v-spacer>
                                <v-chip size="small" :color="event.price > 0 ? 'primary' : 'success'" variant="tonal">
                                    {{ event.price > 0 ? `$${event.price}` : 'Free' }}
                                </v-chip>
                            </div>

                            <div class="d-flex align-center">
                                <v-icon size="small" color="grey" class="mr-1">mdi-map-marker</v-icon>
                                <span class="text-caption text-grey">{{ event.location }}</span>
                            </div>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions class="pa-4">
                            <v-btn variant="tonal" color="primary" block
                                :size="$vuetify.display.smAndDown ? 'large' : 'default'">
                                View Details
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>

                <!-- Empty State -->
                <v-col v-if="filteredEvents.length === 0" cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-8': true
                    }">
                        <div class="text-center">
                            <v-icon size="64" color="grey">mdi-calendar-blank</v-icon>
                            <h3 class="mt-4 text-h6">No Events Found</h3>
                            <p class="text-body-2 text-grey">
                                {{ search ? 'Try adjusting your search or filters' : 'No events are currently scheduled'
                                }}
                            </p>
                            <v-btn color="primary" class="mt-4" @click="showCreateDialog = true">
                                Create an Event
                            </v-btn>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Create Event Dialog -->
        <v-dialog v-model="showCreateDialog" :fullscreen="$vuetify.display.smAndDown" :width="600">
            <v-card>
                <v-toolbar color="primary" :title="'Create New Event'">
                    <v-btn icon @click="showCreateDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pa-4">
                    <v-form @submit.prevent="handleSubmit" ref="form">
                        <v-text-field v-model="newEvent.title" label="Event Title" required
                            :rules="[v => !!v || 'Title is required']" class="mb-4"></v-text-field>

                        <v-textarea v-model="newEvent.description" label="Description" required
                            :rules="[v => !!v || 'Description is required']" class="mb-4"></v-textarea>

                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-select v-model="newEvent.type" :items="eventTypes" label="Event Type" required
                                    :rules="[v => !!v || 'Type is required']"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="newEvent.price" label="Price" type="number" prefix="$" min="0"
                                    required :rules="[v => v >= 0 || 'Price must be positive']"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="newEvent.location" label="Location" required
                                    :rules="[v => !!v || 'Location is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="newEvent.capacity" label="Capacity" type="number" min="1"
                                    required :rules="[v => v > 0 || 'Capacity must be positive']"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="newEvent.image" label="Image URL"
                                    hint="Leave empty for default image" persistent-hint></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="showCreateDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="handleSubmit" :loading="loading">
                        Create Event
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
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
        const form = ref(null)
        const search = ref('')
        const selectedType = ref('')
        const selectedSort = ref('date')
        const showCreateDialog = ref(false)
        const loading = ref(false)

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

        const events = ref([])
        const currentUser = computed(() => store.getters.currentUser)

        const sortOptions = [
            { title: 'Date', value: 'date' },
            { title: 'Price', value: 'price' },
            { title: 'Title', value: 'title' }
        ]

        const filteredEvents = computed(() => {
            let filtered = [...events.value]

            if (search.value) {
                const searchLower = search.value.toLowerCase()
                filtered = filtered.filter(event =>
                    event.title.toLowerCase().includes(searchLower) ||
                    event.description.toLowerCase().includes(searchLower)
                )
            }

            if (selectedType.value) {
                filtered = filtered.filter(event =>
                    event.type.toLowerCase() === selectedType.value.toLowerCase()
                )
            }

            switch (selectedSort.value) {
                case 'date':
                    filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
                    break
                case 'price':
                    filtered.sort((a, b) => a.price - b.price)
                    break
                case 'title':
                    filtered.sort((a, b) => a.title.localeCompare(b.title))
                    break
            }

            return filtered
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

        const newEvent = ref({
            title: '',
            description: '',
            type: '',
            price: 0,
            location: '',
            capacity: 10,
            image: ''
        })

        const handleSubmit = async () => {
            if (!form.value.validate()) return

            loading.value = true
            try {
                const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.state.auth.token}`
                    },
                    body: JSON.stringify(newEvent.value)
                })

                if (!response.ok) throw new Error('Failed to create event')

                const createdEvent = await response.json()
                events.value.unshift(createdEvent)
                showCreateDialog.value = false

                // Reset form
                newEvent.value = {
                    title: '',
                    description: '',
                    type: '',
                    price: 0,
                    location: '',
                    capacity: 10,
                    image: ''
                }
            } catch (error) {
                console.error('Error creating event:', error)
            } finally {
                loading.value = false
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
            registerForEvent,
            form,
            search,
            selectedType,
            selectedSort,
            showCreateDialog,
            newEvent,
            sortOptions,
            handleSubmit
        }
    }
}
</script>

<style scoped>
.events {
    min-height: 100vh;
}

.event-card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.event-card .v-card-actions {
    margin-top: auto;
}

.event-image {
    position: relative;
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

    .event-card {
        margin: 0;
    }

    .event-image {
        border-radius: 0;
    }
}
</style>