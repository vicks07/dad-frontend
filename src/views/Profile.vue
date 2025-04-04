<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <h1 class="text-h4 mb-6">Profile</h1>

                <v-card>
                    <v-card-text>
                        <v-form ref="form" v-model="valid">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="profile.firstName" label="First Name"
                                        :rules="[v => !!v || 'First name is required']" required></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="profile.lastName" label="Last Name"
                                        :rules="[v => !!v || 'Last name is required']" required></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea v-model="profile.bio" label="Bio"
                                        :rules="[v => !!v || 'Bio is required']" required></v-textarea>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model="profile.age" label="Age" type="number" :rules="[
                                        v => !!v || 'Age is required',
                                        v => v >= 30 || 'Must be at least 30 years old',
                                        v => v <= 55 || 'Must be 55 years or younger'
                                    ]" required></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-select v-model="profile.gender" :items="['Male', 'Female', 'Other']"
                                        label="Gender" :rules="[v => !!v || 'Gender is required']" required></v-select>
                                </v-col>

                                <v-col cols="12">
                                    <v-text-field v-model="profile.location" label="Location"
                                        :rules="[v => !!v || 'Location is required']" required></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea v-model="profile.interests" label="Interests"
                                        :rules="[v => !!v || 'Interests are required']" required></v-textarea>
                                </v-col>

                                <v-col cols="12">
                                    <v-slider v-model="profile.emotionalReadiness" label="Emotional Readiness (1-10)"
                                        min="1" max="10" step="1" thumb-label
                                        :rules="[v => !!v || 'Emotional readiness is required']" required></v-slider>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="saveProfile" :loading="loading" :disabled="!valid">
                            Save Profile
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Profile',
    data() {
        return {
            valid: false,
            loading: false,
            profile: {
                firstName: '',
                lastName: '',
                bio: '',
                age: null,
                gender: '',
                location: '',
                interests: '',
                emotionalReadiness: 5
            }
        };
    },
    computed: {
        ...mapState(['currentUser'])
    },
    methods: {
        ...mapActions(['updateProfile']),
        async saveProfile() {
            if (!this.$refs.form.validate()) return;

            this.loading = true;
            try {
                await this.updateProfile(this.profile);
                this.$router.push('/');
            } catch (error) {
                console.error('Error saving profile:', error);
            } finally {
                this.loading = false;
            }
        }
    },
    created() {
        if (this.currentUser) {
            this.profile = { ...this.currentUser };
        }
    }
};
</script>