<template>
    <div class="profile">
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
                                    <v-icon start color="primary" class="mr-2">mdi-account</v-icon>
                                    Profile
                                </v-card-title>
                                <v-card-subtitle class="px-0">
                                    Manage your personal information and preferences
                                </v-card-subtitle>
                            </v-col>
                            <v-col cols="12" sm="4" class="text-sm-right">
                                <v-btn color="primary" prepend-icon="mdi-cog" :block="$vuetify.display.smAndDown"
                                    @click="showSettingsDialog = true">
                                    Settings
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Profile Content -->
            <v-row class="mt-4">
                <!-- Profile Photo Section -->
                <v-col cols="12" md="4">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-4': true
                    }">
                        <div class="text-center">
                            <v-avatar size="150" class="mb-4">
                                <v-img :src="profile.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" cover>
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                            </v-avatar>

                            <v-file-input v-model="newAvatar" accept="image/*" hide-details class="d-none"
                                ref="avatarInput" @change="uploadAvatar"></v-file-input>

                            <v-btn variant="outlined" color="primary" block class="mb-2"
                                @click="$refs.avatarInput.click()">
                                Change Photo
                            </v-btn>

                            <v-btn v-if="profile.avatar" variant="text" color="error" block @click="removeAvatar">
                                Remove Photo
                            </v-btn>
                        </div>
                    </v-card>
                </v-col>

                <!-- Profile Info Section -->
                <v-col cols="12" md="8">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-4': true
                    }">
                        <v-form @submit.prevent="saveProfile" ref="form">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="profile.firstName" label="First Name" required
                                        :rules="[v => !!v || 'First name is required']"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="profile.lastName" label="Last Name" required
                                        :rules="[v => !!v || 'Last name is required']"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="profile.email" label="Email" type="email" required :rules="[
                                        v => !!v || 'Email is required',
                                        v => /.+@.+\..+/.test(v) || 'Email must be valid'
                                    ]"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="profile.phone" label="Phone" type="tel" :rules="[
                                        v => !v || /^\d{10}$/.test(v) || 'Phone must be 10 digits'
                                    ]"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="profile.location" label="Location" required
                                        :rules="[v => !!v || 'Location is required']"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="profile.profession" label="Profession"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-textarea v-model="profile.bio" label="Bio" rows="3" counter="500" :rules="[
                                        v => !v || v.length <= 500 || 'Bio must be less than 500 characters'
                                    ]"></v-textarea>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-combobox v-model="profile.interests" :items="interestOptions" label="Interests"
                                        multiple chips closable-chips :rules="[
                                            v => v.length <= 10 || 'Maximum 10 interests allowed'
                                        ]"></v-combobox>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-btn color="primary" type="submit" :loading="loading"
                                        :block="$vuetify.display.smAndDown">
                                        Save Changes
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Settings Dialog -->
        <v-dialog v-model="showSettingsDialog" :fullscreen="$vuetify.display.smAndDown" :width="600">
            <v-card>
                <v-toolbar color="primary" :title="'Account Settings'">
                    <v-btn icon @click="showSettingsDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pa-4">
                    <v-list>
                        <v-list-item prepend-icon="mdi-lock" title="Change Password"
                            @click="showChangePasswordDialog = true"></v-list-item>
                        <v-list-item prepend-icon="mdi-bell" title="Notification Settings"
                            @click="showNotificationDialog = true"></v-list-item>
                        <v-list-item prepend-icon="mdi-shield" title="Privacy Settings"
                            @click="showPrivacyDialog = true"></v-list-item>
                        <v-list-item prepend-icon="mdi-credit-card"
                            :title="subscription ? 'Manage Subscription' : 'Upgrade to Premium'"
                            :to="'/subscription'"></v-list-item>
                        <v-list-item prepend-icon="mdi-delete" title="Delete Account" @click="showDeleteDialog = true"
                            class="text-error"></v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Change Password Dialog -->
        <v-dialog v-model="showChangePasswordDialog" :fullscreen="$vuetify.display.smAndDown" :width="400">
            <v-card>
                <v-toolbar color="primary" :title="'Change Password'">
                    <v-btn icon @click="showChangePasswordDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pa-4">
                    <v-form @submit.prevent="changePassword" ref="passwordForm">
                        <v-text-field v-model="passwords.current" label="Current Password" type="password" required
                            :rules="[v => !!v || 'Current password is required']"></v-text-field>

                        <v-text-field v-model="passwords.new" label="New Password" type="password" required :rules="[
                            v => !!v || 'New password is required',
                            v => v.length >= 8 || 'Password must be at least 8 characters'
                        ]"></v-text-field>

                        <v-text-field v-model="passwords.confirm" label="Confirm Password" type="password" required
                            :rules="[
                                v => !!v || 'Please confirm your password',
                                v => v === passwords.new || 'Passwords must match'
                            ]"></v-text-field>
                    </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="showChangePasswordDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="changePassword" :loading="loading">
                        Change Password
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Account Dialog -->
        <v-dialog v-model="showDeleteDialog" :fullscreen="$vuetify.display.smAndDown" :width="400">
            <v-card>
                <v-card-title class="text-error">Delete Account</v-card-title>
                <v-card-text>
                    <p class="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                    <v-text-field v-model="deleteConfirmation" label="Type 'DELETE' to confirm"
                        :rules="[v => v === 'DELETE' || 'Please type DELETE to confirm']"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="showDeleteDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="error" :disabled="deleteConfirmation !== 'DELETE'" @click="deleteAccount"
                        :loading="loading">
                        Delete Account
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

export default {
    name: 'Profile',

    setup() {
        const store = useStore()
        const router = useRouter()
        const form = ref(null)
        const passwordForm = ref(null)
        const loading = ref(false)
        const showSettingsDialog = ref(false)
        const showChangePasswordDialog = ref(false)
        const showNotificationDialog = ref(false)
        const showPrivacyDialog = ref(false)
        const showDeleteDialog = ref(false)
        const deleteConfirmation = ref('')
        const newAvatar = ref(null)

        const profile = ref({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            location: '',
            profession: '',
            bio: '',
            interests: [],
            avatar: null
        })

        const passwords = ref({
            current: '',
            new: '',
            confirm: ''
        })

        const subscription = computed(() => store.state.auth.user?.subscription)

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

        const saveProfile = async () => {
            if (!form.value.validate()) return

            loading.value = true
            try {
                const response = await fetch('/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.state.auth.token}`
                    },
                    body: JSON.stringify(profile.value)
                })

                if (!response.ok) throw new Error('Failed to update profile')

                // Update store with new profile data
                const updatedProfile = await response.json()
                store.commit('setUser', updatedProfile)
            } catch (error) {
                console.error('Error updating profile:', error)
            } finally {
                loading.value = false
            }
        }

        const uploadAvatar = async () => {
            if (!newAvatar.value) return

            loading.value = true
            try {
                const formData = new FormData()
                formData.append('avatar', newAvatar.value)

                const response = await fetch('/api/users/avatar', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${store.state.auth.token}`
                    },
                    body: formData
                })

                if (!response.ok) throw new Error('Failed to upload avatar')

                const { avatarUrl } = await response.json()
                profile.value.avatar = avatarUrl
            } catch (error) {
                console.error('Error uploading avatar:', error)
            } finally {
                loading.value = false
                newAvatar.value = null
            }
        }

        const removeAvatar = async () => {
            loading.value = true
            try {
                const response = await fetch('/api/users/avatar', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${store.state.auth.token}`
                    }
                })

                if (!response.ok) throw new Error('Failed to remove avatar')

                profile.value.avatar = null
            } catch (error) {
                console.error('Error removing avatar:', error)
            } finally {
                loading.value = false
            }
        }

        const changePassword = async () => {
            if (!passwordForm.value.validate()) return

            loading.value = true
            try {
                const response = await fetch('/api/users/password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.state.auth.token}`
                    },
                    body: JSON.stringify({
                        currentPassword: passwords.value.current,
                        newPassword: passwords.value.new
                    })
                })

                if (!response.ok) throw new Error('Failed to change password')

                showChangePasswordDialog.value = false
                passwords.value = { current: '', new: '', confirm: '' }
            } catch (error) {
                console.error('Error changing password:', error)
            } finally {
                loading.value = false
            }
        }

        const deleteAccount = async () => {
            if (deleteConfirmation.value !== 'DELETE') return

            loading.value = true
            try {
                const response = await fetch('/api/users', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${store.state.auth.token}`
                    }
                })

                if (!response.ok) throw new Error('Failed to delete account')

                await store.dispatch('logout')
                router.push('/login')
            } catch (error) {
                console.error('Error deleting account:', error)
            } finally {
                loading.value = false
            }
        }

        // Load profile data
        onMounted(async () => {
            try {
                const response = await fetch('/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${store.state.auth.token}`
                    }
                })
                const data = await response.json()
                profile.value = { ...profile.value, ...data }
            } catch (error) {
                console.error('Error loading profile:', error)
            }
        })

        return {
            form,
            passwordForm,
            loading,
            showSettingsDialog,
            showChangePasswordDialog,
            showNotificationDialog,
            showPrivacyDialog,
            showDeleteDialog,
            deleteConfirmation,
            newAvatar,
            profile,
            passwords,
            subscription,
            interestOptions,
            saveProfile,
            uploadAvatar,
            removeAvatar,
            changePassword,
            deleteAccount
        }
    }
}
</script>

<style scoped>
.profile {
    min-height: 100vh;
}

.v-avatar {
    border: 4px solid rgb(var(--v-theme-primary));
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