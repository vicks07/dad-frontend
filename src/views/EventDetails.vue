<template>
    <div class="event-details">
        <v-container :class="{ 'pa-0': $vuetify.display.smAndDown }">
            <!-- Loading State -->
            <v-row v-if="loading">
                <v-col cols="12" class="text-center">
                    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
                </v-col>
            </v-row>

            <template v-else-if="event">
                <!-- Event Header -->
                <v-row>
                    <v-col cols="12">
                        <v-card :class="{
                            'mobile-card': $vuetify.display.smAndDown,
                            'pa-6': $vuetify.display.mdAndUp,
                            'pa-4': $vuetify.display.smAndDown
                        }">
                            <v-img :src="event.image || 'https://picsum.photos/1920/1080?random'"
                                :height="$vuetify.display.smAndDown ? 200 : 300" cover class="rounded-t-lg">
                                <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                    </v-row>
                                </template>
                            </v-img>

                            <v-card-text class="pa-4">
                                <div class="d-flex flex-wrap align-center justify-space-between mb-4">
                                    <div>
                                        <h1 class="text-h4 mb-2">{{ event.title }}</h1>
                                        <div class="d-flex flex-wrap align-center">
                                            <v-chip color="primary" size="small" class="mr-2 mb-2">
                                                {{ event.type }}
                                            </v-chip>
                                            <v-chip :color="event.price > 0 ? 'success' : 'info'" size="small"
                                                class="mr-2 mb-2">
                                                {{ event.price > 0 ? `$${event.price}` : 'Free' }}
                                            </v-chip>
                                            <v-chip :color="getStatusColor(event.status)" size="small" class="mb-2">
                                                {{ event.status }}
                                            </v-chip>
                                        </div>
                                    </div>

                                    <v-btn v-if="!isHost" :color="isAttending ? 'error' : 'primary'"
                                        :prepend-icon="isAttending ? 'mdi-close' : 'mdi-check'" :loading="actionLoading"
                                        :block="$vuetify.display.smAndDown" class="mt-2" @click="toggleAttendance">
                                        {{ isAttending ? 'Cancel RSVP' : 'RSVP' }}
                                    </v-btn>
                                </div>

                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <div class="d-flex align-center mb-4">
                                            <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                                            <div>
                                                <div class="text-subtitle-1">{{ formatDate(event.date) }}</div>
                                                <div class="text-caption">{{ formatTime(event.startTime) }} - {{
                                                    formatTime(event.endTime) }}</div>
                                            </div>
                                        </div>

                                        <div class="d-flex align-center mb-4">
                                            <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                                            <div>
                                                <div class="text-subtitle-1">{{ event.location }}</div>
                                                <div class="text-caption">{{ event.address }}</div>
                                            </div>
                                        </div>

                                        <div class="d-flex align-center">
                                            <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
                                            <div>
                                                <div class="text-subtitle-1">{{ event.attendees?.length || 0 }}
                                                    Attending</div>
                                                <div class="text-caption">{{ event.capacity ? `${event.capacity -
                                                    (event.attendees?.length || 0)}
                                                    spots left` : 'Unlimited spots' }}</div>
                                            </div>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <div class="d-flex align-center mb-4">
                                            <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                                            <div>
                                                <div class="text-subtitle-1">Hosted by {{ event.host.name }}</div>
                                                <div class="text-caption">{{ event.host.bio }}</div>
                                            </div>
                                        </div>

                                        <div class="d-flex align-center">
                                            <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                                            <div class="text-subtitle-1">{{ event.description }}</div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Attendees Section -->
                <v-row class="mt-4">
                    <v-col cols="12">
                        <v-card :class="{
                            'mobile-card': $vuetify.display.smAndDown,
                            'pa-4': true
                        }">
                            <v-card-title class="px-0">
                                <v-icon start color="primary" class="mr-2">mdi-account-group</v-icon>
                                Attendees
                            </v-card-title>

                            <v-card-text class="px-0">
                                <v-row>
                                    <v-col v-for="attendee in event.attendees" :key="attendee.id" cols="12" sm="6"
                                        md="4">
                                        <v-card variant="outlined" class="mb-2">
                                            <v-card-item>
                                                <template v-slot:prepend>
                                                    <v-avatar :image="attendee.avatar"
                                                        :color="!attendee.avatar ? 'primary' : undefined" size="40">
                                                        <v-icon v-if="!attendee.avatar"
                                                            color="white">mdi-account</v-icon>
                                                    </v-avatar>
                                                </template>

                                                <v-card-title>{{ attendee.name }}</v-card-title>
                                                <v-card-subtitle>{{ attendee.location }}</v-card-subtitle>
                                            </v-card-item>
                                        </v-card>
                                    </v-col>
                                </v-row>

                                <v-row v-if="!event.attendees?.length">
                                    <v-col cols="12" class="text-center">
                                        <v-icon color="grey" size="64" class="mb-2">
                                            mdi-account-group-outline
                                        </v-icon>
                                        <div class="text-body-1 text-grey">No attendees yet. Be the first to RSVP!</div>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Discussion Section -->
                <v-row class="mt-4">
                    <v-col cols="12">
                        <v-card :class="{
                            'mobile-card': $vuetify.display.smAndDown,
                            'pa-4': true
                        }">
                            <v-card-title class="px-0">
                                <v-icon start color="primary" class="mr-2">mdi-forum</v-icon>
                                Discussion
                            </v-card-title>

                            <v-card-text class="px-0">
                                <v-list v-if="event.comments?.length">
                                    <v-list-item v-for="comment in event.comments" :key="comment.id"
                                        :title="comment.user.name" :subtitle="formatDate(comment.date)">
                                        <template v-slot:prepend>
                                            <v-avatar :image="comment.user.avatar"
                                                :color="!comment.user.avatar ? 'primary' : undefined" size="40">
                                                <v-icon v-if="!comment.user.avatar" color="white">mdi-account</v-icon>
                                            </v-avatar>
                                        </template>

                                        <div class="text-body-1 mt-2">{{ comment.text }}</div>
                                    </v-list-item>
                                </v-list>

                                <v-row v-else>
                                    <v-col cols="12" class="text-center">
                                        <v-icon color="grey" size="64" class="mb-2">
                                            mdi-forum-outline
                                        </v-icon>
                                        <div class="text-body-1 text-grey">No comments yet. Start the discussion!</div>
                                    </v-col>
                                </v-row>

                                <v-form @submit.prevent="addComment" class="mt-4">
                                    <v-textarea v-model="newComment" label="Add a comment" rows="3" counter="500"
                                        :rules="[
                                            v => !v || v.length <= 500 || 'Comment must be less than 500 characters'
                                        ]"></v-textarea>

                                    <v-btn color="primary" type="submit" :loading="commentLoading"
                                        :block="$vuetify.display.smAndDown" class="mt-2">
                                        Post Comment
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </template>

            <!-- Error State -->
            <v-row v-else>
                <v-col cols="12" class="text-center">
                    <v-icon color="error" size="64" class="mb-2">
                        mdi-alert-circle
                    </v-icon>
                    <div class="text-h6 text-error mb-2">Event Not Found</div>
                    <v-btn color="primary" prepend-icon="mdi-arrow-left" to="/events">
                        Back to Events
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { format } from 'date-fns'

export default {
    name: 'EventDetails',

    setup() {
        const store = useStore()
        const route = useRoute()

        const loading = ref(true)
        const actionLoading = ref(false)
        const commentLoading = ref(false)
        const event = ref(null)
        const newComment = ref('')

        const isHost = computed(() => {
            return event.value?.host.id === store.state.auth.user?.id
        })

        const isAttending = computed(() => {
            return event.value?.attendees?.some(a => a.id === store.state.auth.user?.id)
        })

        const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
                case 'upcoming':
                    return 'warning'
                case 'in progress':
                    return 'success'
                case 'completed':
                    return 'info'
                case 'cancelled':
                    return 'error'
                default:
                    return 'grey'
            }
        }

        const formatDate = (date) => {
            return format(new Date(date), 'MMMM d, yyyy')
        }

        const formatTime = (time) => {
            return format(new Date(`2000-01-01T${time}`), 'h:mm a')
        }

        const loadEvent = async () => {
            loading.value = true
            try {
                const response = await fetch(`/api/events/${route.params.id}`, {
                    headers: {
                        'Authorization': `Bearer ${store.state.auth.token}`
                    }
                })

                if (!response.ok) throw new Error('Event not found')

                event.value = await response.json()
            } catch (error) {
                console.error('Error loading event:', error)
                event.value = null
            } finally {
                loading.value = false
            }
        }

        const toggleAttendance = async () => {
            actionLoading.value = true
            try {
                const method = isAttending.value ? 'DELETE' : 'POST'
                const response = await fetch(`/api/events/${event.value.id}/attendance`, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${store.state.auth.token}`
                    }
                })

                if (!response.ok) throw new Error('Failed to update attendance')

                // Refresh event data
                await loadEvent()

                store.commit('setSnackbar', {
                    text: isAttending.value ? 'Successfully cancelled RSVP' : 'Successfully RSVP\'d',
                    color: 'success'
                })
            } catch (error) {
                console.error('Error updating attendance:', error)
                store.commit('setSnackbar', {
                    text: 'Failed to update attendance',
                    color: 'error'
                })
            } finally {
                actionLoading.value = false
            }
        }

        const addComment = async () => {
            if (!newComment.value) return

            commentLoading.value = true
            try {
                const response = await fetch(`/api/events/${event.value.id}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.state.auth.token}`
                    },
                    body: JSON.stringify({
                        text: newComment.value
                    })
                })

                if (!response.ok) throw new Error('Failed to add comment')

                // Reset form and refresh event data
                newComment.value = ''
                await loadEvent()

                store.commit('setSnackbar', {
                    text: 'Comment added successfully',
                    color: 'success'
                })
            } catch (error) {
                console.error('Error adding comment:', error)
                store.commit('setSnackbar', {
                    text: 'Failed to add comment',
                    color: 'error'
                })
            } finally {
                commentLoading.value = false
            }
        }

        onMounted(() => {
            loadEvent()
        })

        return {
            loading,
            actionLoading,
            commentLoading,
            event,
            newComment,
            isHost,
            isAttending,
            getStatusColor,
            formatDate,
            formatTime,
            toggleAttendance,
            addComment
        }
    }
}
</script>

<style scoped>
.event-details {
    min-height: 100vh;
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

    .v-dialog .v-card {
        border-radius: 0;
    }
}
</style>