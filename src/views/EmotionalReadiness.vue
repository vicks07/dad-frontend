<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card class="mb-6">
                    <v-card-title class="text-h5 primary--text">
                        Emotional Readiness Assessment
                    </v-card-title>
                    <v-card-text>
                        <p class="text-body-1 mb-4">
                            This assessment helps us understand your emotional state and readiness for new connections.
                            There are no right or wrong answers - be honest with yourself.
                        </p>
                        <p class="text-body-2 grey--text">
                            Your responses will help us suggest appropriate events and matches for you.
                        </p>
                    </v-card-text>
                </v-card>

                <v-form ref="form" v-model="valid">
                    <v-card v-for="(question, index) in questions" :key="index" class="mb-4">
                        <v-card-text>
                            <div class="text-h6 mb-4">{{ question.text }}</div>
                            <v-radio-group v-model="answers[index]" :rules="[v => !!v || 'Please select an answer']">
                                <v-radio v-for="option in question.options" :key="option.value" :label="option.text"
                                    :value="option.value"></v-radio>
                            </v-radio-group>
                        </v-card-text>
                    </v-card>

                    <v-card class="mb-4">
                        <v-card-text>
                            <v-textarea v-model="additionalNotes"
                                label="Additional thoughts or concerns you'd like to share" rows="4" auto-grow
                                hint="This is optional but can help us better understand your needs"
                                persistent-hint></v-textarea>
                        </v-card-text>
                    </v-card>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" :loading="loading" :disabled="!valid || loading"
                            @click="submitAssessment">
                            Complete Assessment
                        </v-btn>
                    </v-card-actions>
                </v-form>

                <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
                    {{ snackbarText }}
                </v-snackbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'EmotionalReadiness',
    setup() {
        const store = useStore()
        const router = useRouter()
        const form = ref(null)
        const valid = ref(false)
        const answers = ref([])
        const additionalNotes = ref('')
        const snackbar = ref(false)
        const snackbarText = ref('')
        const snackbarColor = ref('error')

        const loading = computed(() => store.getters.loading)
        const error = computed(() => store.getters.error)

        const questions = [
            {
                text: "How long has it been since your divorce was finalized?",
                options: [
                    { text: "Less than 6 months", value: 1 },
                    { text: "6-12 months", value: 2 },
                    { text: "1-2 years", value: 3 },
                    { text: "More than 2 years", value: 4 }
                ]
            },
            {
                text: "How would you describe your current emotional state?",
                options: [
                    { text: "Still healing and processing", value: 1 },
                    { text: "Mostly healed, but some ups and downs", value: 2 },
                    { text: "Generally stable and positive", value: 3 },
                    { text: "Ready for new connections", value: 4 }
                ]
            },
            {
                text: "How comfortable are you with meeting new people in social settings?",
                options: [
                    { text: "Not comfortable yet", value: 1 },
                    { text: "Somewhat comfortable", value: 2 },
                    { text: "Quite comfortable", value: 3 },
                    { text: "Very comfortable", value: 4 }
                ]
            },
            {
                text: "How do you feel about physical touch (hugs, handshakes, etc.)?",
                options: [
                    { text: "Not ready for physical contact", value: 1 },
                    { text: "Comfortable with minimal contact", value: 2 },
                    { text: "Generally comfortable with appropriate touch", value: 3 },
                    { text: "Comfortable with normal social touch", value: 4 }
                ]
            },
            {
                text: "How would you rate your support system?",
                options: [
                    { text: "Limited support", value: 1 },
                    { text: "Some support", value: 2 },
                    { text: "Good support", value: 3 },
                    { text: "Strong support system", value: 4 }
                ]
            },
            {
                text: "How do you feel about your children (if any) meeting potential partners?",
                options: [
                    { text: "Not ready to consider this", value: 1 },
                    { text: "Would need significant time before considering", value: 2 },
                    { text: "Open to it after getting to know someone well", value: 3 },
                    { text: "Comfortable with appropriate introductions", value: 4 }
                ]
            }
        ]

        const calculateScore = () => {
            const total = answers.value.reduce((sum, value) => sum + value, 0)
            return Math.round((total / (questions.length * 4)) * 10)
        }

        const submitAssessment = async () => {
            const { valid } = await form.value.validate()

            if (!valid) return

            try {
                const score = calculateScore()
                await store.dispatch('updateEmotionalReadiness', {
                    score,
                    answers: answers.value,
                    notes: additionalNotes.value
                })

                snackbarColor.value = 'success'
                snackbarText.value = 'Assessment completed successfully!'
                snackbar.value = true

                router.push('/events')
            } catch (err) {
                snackbarColor.value = 'error'
                snackbarText.value = error.value || 'Failed to save assessment. Please try again.'
                snackbar.value = true
            }
        }

        return {
            form,
            valid,
            questions,
            answers,
            additionalNotes,
            loading,
            snackbar,
            snackbarText,
            snackbarColor,
            submitAssessment
        }
    }
}
</script>

<style scoped>
.v-card {
    border-radius: 8px;
}

.v-card-text {
    padding: 24px;
}

.v-btn {
    text-transform: none;
    letter-spacing: 0.5px;
}

.v-radio-group {
    margin-top: 8px;
}
</style>