<template>
    <div class="matches">
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
                                    <v-icon start color="error" class="mr-2">mdi-heart</v-icon>
                                    Your Matches
                                </v-card-title>
                                <v-card-subtitle class="px-0">
                                    Connect with people who share your journey
                                </v-card-subtitle>
                            </v-col>
                            <v-col cols="12" sm="4" class="text-sm-right">
                                <v-btn color="primary" prepend-icon="mdi-tune" :block="$vuetify.display.smAndDown"
                                    @click="showPreferencesDialog = true">
                                    Preferences
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
                                <v-text-field v-model="search" label="Search matches" prepend-inner-icon="mdi-magnify"
                                    variant="outlined" density="comfortable" hide-details
                                    class="mb-4 mb-sm-0"></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="4">
                                <v-select v-model="selectedDistance" :items="distanceOptions" label="Distance"
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

            <!-- Matches Grid -->
            <v-row class="mt-4">
                <v-col v-for="match in filteredMatches" :key="match._id" cols="12" sm="6" md="4" lg="3">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'match-card': true
                    }" :ripple="true">
                        <v-img :src="match.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" height="300" cover
                            class="match-image">
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>

                        <v-card-title class="pt-4 px-4">
                            {{ match.firstName }} {{ match.lastName }}
                            <v-icon v-if="match.verified" color="primary" size="small" class="ml-2">
                                mdi-check-decagram
                            </v-icon>
                        </v-card-title>

                        <v-card-subtitle class="px-4">
                            {{ match.age }} years • {{ match.location }}
                        </v-card-subtitle>

                        <v-card-text class="px-4">
                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" color="primary" class="mr-2">mdi-briefcase</v-icon>
                                <span class="text-body-2">{{ match.profession }}</span>
                            </div>

                            <div class="d-flex align-center mb-2">
                                <v-icon size="small" color="primary" class="mr-2">mdi-school</v-icon>
                                <span class="text-body-2">{{ match.education }}</span>
                            </div>

                            <div class="interests mt-4">
                                <v-chip v-for="interest in match.interests.slice(0, 3)" :key="interest" size="small"
                                    class="mr-2 mb-2" color="primary" variant="outlined">
                                    {{ interest }}
                                </v-chip>
                                <v-chip v-if="match.interests.length > 3" size="small" class="mb-2" color="primary"
                                    variant="outlined">
                                    +{{ match.interests.length - 3 }} more
                                </v-chip>
                            </div>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions class="pa-4">
                            <v-btn variant="text" color="error" :size="$vuetify.display.smAndDown ? 'large' : 'default'"
                                @click="likeProfile(match._id)" class="flex-grow-1">
                                <v-icon start>mdi-heart</v-icon>
                                Like
                            </v-btn>
                            <v-btn variant="text" color="primary"
                                :size="$vuetify.display.smAndDown ? 'large' : 'default'" :to="'/messages/' + match._id"
                                class="flex-grow-1">
                                <v-icon start>mdi-message</v-icon>
                                Message
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>

                <!-- Empty State -->
                <v-col v-if="filteredMatches.length === 0" cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-8': true
                    }">
                        <div class="text-center">
                            <v-icon size="64" color="grey">mdi-heart-outline</v-icon>
                            <h3 class="mt-4 text-h6">No Matches Found</h3>
                            <p class="text-body-2 text-grey">
                                {{ search ?
                                    'Try adjusting your search or filters' :
                                    "Update your preferences to finmore matches"
                                }}
                            </p>
                            <v-btn color="primary" class="mt-4" @click="showPreferencesDialog = true">
                                Update Preferences
                            </v-btn>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Preferences Dialog -->
        <v-dialog v-model="showPreferencesDialog" :fullscreen="$vuetify.display.smAndDown" :width="600">
            <v-card>
                <v-toolbar color="primary" :title="'Match Preferences'">
                    <v-btn icon @click="showPreferencesDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pa-4">
                    <v-form @submit.prevent="savePreferences" ref="form">
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="preferences.minAge" label="Minimum Age" type="number" min="18"
                                    required
                                    :rules="[v => v >= 18 || 'Minimum age must be 18 or above']"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="preferences.maxAge" label="Maximum Age" type="number" required
                                    :rules="[
                                        v => v >= preferences.minAge || 'Maximum age must be greater than minimum age'
                                    ]"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-select v-model="preferences.gender" :items="genderOptions" label="Preferred Gender"
                                    required :rules="[v => !!v || 'Gender preference is required']"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select v-model="preferences.distance" :items="distanceOptions"
                                    label="Maximum Distance" required
                                    :rules="[v => !!v || 'Distance preference is required']"></v-select>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <v-combobox v-model="preferences.interests" :items="interestOptions" label="Interests"
                                    multiple chips closable-chips :rules="[
                                        v => v.length <= 10 || 'Maximum 10 interests allowed'
                                    ]"></v-combobox>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="showPreferencesDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="savePreferences" :loading="loading">
                        Save Preferences
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Matches',

    setup() {
        const store = useStore()
        const form = ref(null)
        const search = ref('')
        const selectedDistance = ref('50')
        const selectedSort = ref('distance')
        const showPreferencesDialog = ref(false)
        const loading = ref(false)

        const matches = ref([])
        const distanceOptions = [
            { title: '5 miles', value: '5' },
            { title: '10 miles', value: '10' },
            { title: '25 miles', value: '25' },
            { title: '50 miles', value: '50' },
            { title: '100 miles', value: '100' }
        ]
        const sortOptions = [
            { title: 'Distance', value: 'distance' },
            { title: 'Age', value: 'age' },
            { title: 'Recently Active', value: 'activity' }
        ]
        const genderOptions = ['Male', 'Female', 'Non-Binary', 'Any']
        const interestOptions = [
            'Reading',
            'Hiking',
            'Cooking',
            'Travel',
            'Music',
            'Art',
            'Sports',
            'Movies',
            'Photography',
            'Yoga',
            'Dancing',
            'Writing'
        ]

        const preferences = ref({
            minAge: 25,
            maxAge: 45,
            gender: 'Any',
            distance: '50',
            interests: []
        })

        const filteredMatches = computed(() => {
            let filtered = [...matches.value]

            if (search.value) {
                const searchLower = search.value.toLowerCase()
                filtered = filtered.filter(match =>
                    match.firstName.toLowerCase().includes(searchLower) ||
                    match.lastName.toLowerCase().includes(searchLower) ||
                    match.profession.toLowerCase().includes(searchLower)
                )
            }

            if (selectedDistance.value) {
                filtered = filtered.filter(match =>
                    parseInt(match.distance) <= parseInt(selectedDistance.value)
                )
            }

            switch (selectedSort.value) {
                case 'distance':
                    filtered.sort((a, b) => parseInt(a.distance) - parseInt(b.distance))
                    break
                case 'age':
                    filtered.sort((a, b) => a.age - b.age)
                    break
                case 'activity':
                    filtered.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
                    break
            }

            return filtered
        })

        const likeProfile = async (matchId) => {
            try {
                const response = await fetch(`/api/matches/like/${matchId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${store.state.auth.token}`
                    }
                })

                if (!response.ok) throw new Error('Failed to like profile')

                // Update the matches list or show a success message
            } catch (error) {
                console.error('Error liking profile:', error)
            }
        }

        const savePreferences = async () => {
            if (!form.value.validate()) return

            loading.value = true
            try {
                const response = await fetch('/api/matches/preferences', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.state.auth.token}`
                    },
                    body: JSON.stringify(preferences.value)
                })

                if (!response.ok) throw new Error('Failed to save preferences')

                showPreferencesDialog.value = false
                // Refresh matches with new preferences
                loadMatches()
            } catch (error) {
                console.error('Error saving preferences:', error)
            } finally {
                loading.value = false
            }
        }

        const loadMatches = async () => {
            try {
                const response = await fetch('/api/matches')
                matches.value = await response.json()
            } catch (error) {
                console.error('Error loading matches:', error)
            }
        }

        // Load matches on mount
        loadMatches()

        return {
            form,
            search,
            selectedDistance,
            selectedSort,
            showPreferencesDialog,
            loading,
            matches,
            preferences,
            distanceOptions,
            sortOptions,
            genderOptions,
            interestOptions,
            filteredMatches,
            likeProfile,
            savePreferences
        }
    }
}
</script>
<style scoped>
.matches {
    min-height: 100vh;
}

.match-card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.match-card .v-card-actions {
    margin-top: auto;
}

.match-image {
    position: relative;
}

.interests {
    display: flex;
    flex-wrap: wrap;
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

    .match-card {
        margin: 0;
    }

    .match-image {
        border-radius: 0;
    }

    .v-card-actions {
        flex-wrap: nowrap;
    }

    .v-card-actions .v-btn {
        min-width: 0;
        padding: 0 8px;
    }
}
</style>