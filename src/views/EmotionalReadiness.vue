<template>
    <div class="emotional-readiness">
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
                                    <v-icon start color="primary" class="mr-2">mdi-heart</v-icon>
                                    Emotional Readiness Assessment
                                </v-card-title>
                                <v-card-subtitle class="px-0">
                                    Help us understand where you are in your journey
                                </v-card-subtitle>
                            </v-col>
                            <v-col cols="12" sm="4" class="text-sm-right">
                                <v-btn color="primary" prepend-icon="mdi-history" :block="$vuetify.display.smAndDown"
                                    @click="showHistory = true">
                                    View History
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Assessment Form -->
            <v-row class="mt-4">
                <v-col cols="12">
                    <v-card :class="{
                        'mobile-card': $vuetify.display.smAndDown,
                        'pa-4': true
                    }">
                        <v-form ref="form" @submit.prevent="submitAssessment">
                            <v-row>
                                <v-col cols="12">
                                    <v-slider v-model="assessment.overallReadiness" label="Overall Emotional Readiness"
                                        min="1" max="10" thumb-label ticks="always" :tick-labels="readinessLabels"
                                        :rules="[v => v !== null || 'Please rate your overall readiness']" class="mb-6">
                                        <template v-slot:thumb-label="{ modelValue }">
                                            {{ modelValue }}
                                        </template>
                                    </v-slider>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-expansion-panels variant="accordion">
                                        <v-expansion-panel v-for="(category, index) in categories" :key="index">
                                            <v-expansion-panel-title>
                                                <v-row no-gutters>
                                                    <v-col cols="10">
                                                        {{ category.title }}
                                                    </v-col>
                                                    <v-col cols="2" class="text-right">
                                                        <v-chip :color="getCategoryColor(assessment[category.key])"
                                                            size="small" class="ml-2">
                                                            {{ assessment[category.key] || '-' }}/10
                                                        </v-chip>
                                                    </v-col>
                                                </v-row>
                                            </v-expansion-panel-title>
                                            <v-expansion-panel-text>
                                                <p class="mb-4">{{ category.description }}</p>
                                                <v-slider v-model="assessment[category.key]" :label="category.title"
                                                    min="1" max="10" thumb-label ticks
                                                    :rules="[v => v !== null || `Please rate your ${category.title.toLowerCase()}`]">
                                                    <template v-slot:thumb-label="{ modelValue }">
                                                        {{ modelValue }}
                                                    </template>
                                                </v-slider>
                                            </v-expansion-panel-text>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-textarea v-model="assessment.notes" label="Additional Notes" rows="3"
                                        counter="500" :rules="[
                                            v => !v || v.length <= 500 || 'Notes must be less than 500 characters'
                                        ]" placeholder="Share any thoughts or feelings about your current emotional state..."></v-textarea>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-btn color="primary" type="submit" :loading="loading"
                                        :block="$vuetify.display.smAndDown" size="large">
                                        Submit Assessment
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- History Dialog -->
        <v-dialog v-model="showHistory" :fullscreen="$vuetify.display.smAndDown" :width="800">
            <v-card>
                <v-toolbar color="primary" :title="'Assessment History'">
                    <v-btn icon @click="showHistory = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pa-4">
                    <v-row>
                        <v-col cols="12">
                            <v-chart class="chart" :option="chartOption" autoresize />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-list lines="two">
                                <v-list-subheader>Past Assessments</v-list-subheader>
                                <v-list-item v-for="(assessment, index) in assessmentHistory" :key="index"
                                    :title="formatDate(assessment.date)"
                                    :subtitle="assessment.notes || 'No notes provided'">
                                    <template v-slot:prepend>
                                        <v-avatar :color="getCategoryColor(assessment.overallReadiness)" size="40">
                                            {{ assessment.overallReadiness }}
                                        </v-avatar>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { format } from 'date-fns'

use([
    CanvasRenderer,
    LineChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent
])

export default {
    name: 'EmotionalReadiness',

    components: {
        VChart
    },

    setup() {
        const store = useStore()
        const form = ref(null)
        const loading = ref(false)
        const showHistory = ref(false)
        const assessmentHistory = ref([])

        const assessment = ref({
            overallReadiness: null,
            emotionalStability: null,
            socialSupport: null,
            selfAwareness: null,
            pastResolution: null,
            futureOptimism: null,
            notes: ''
        })

        const categories = [
            {
                key: 'emotionalStability',
                title: 'Emotional Stability',
                description: 'How well are you managing your emotions day to day?'
            },
            {
                key: 'socialSupport',
                title: 'Social Support',
                description: 'How strong is your support network of friends and family?'
            },
            {
                key: 'selfAwareness',
                title: 'Self-Awareness',
                description: 'How well do you understand your own needs and feelings?'
            },
            {
                key: 'pastResolution',
                title: 'Past Resolution',
                description: 'How well have you processed and accepted your past relationship?'
            },
            {
                key: 'futureOptimism',
                title: 'Future Optimism',
                description: 'How optimistic do you feel about future relationships?'
            }
        ]

        const readinessLabels = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
        ]

        const chartOption = computed(() => ({
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    const date = format(new Date(params[0].value[0]), 'MMM d, yyyy')
                    let result = `<strong>${date}</strong><br/>`
                    params.forEach(param => {
                        result += `${param.seriesName}: ${param.value[1]}<br/>`
                    })
                    return result
                }
            },
            legend: {
                data: ['Overall Readiness', ...categories.map(c => c.title)],
                type: 'scroll',
                orient: 'horizontal',
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'time',
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                min: 1,
                max: 10
            },
            series: [
                {
                    name: 'Overall Readiness',
                    type: 'line',
                    data: assessmentHistory.value.map(a => [new Date(a.date), a.overallReadiness]),
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3
                    }
                },
                ...categories.map(category => ({
                    name: category.title,
                    type: 'line',
                    data: assessmentHistory.value.map(a => [new Date(a.date), a[category.key]]),
                    symbol: 'circle',
                    symbolSize: 6
                }))
            ],
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }
            ]
        }))

        const getCategoryColor = (value) => {
            if (!value) return 'grey'
            if (value <= 3) return 'error'
            if (value <= 6) return 'warning'
            return 'success'
        }

        const formatDate = (date) => {
            return format(new Date(date), 'MMMM d, yyyy')
        }

        const submitAssessment = async () => {
            if (!form.value.validate()) return

            loading.value = true
            try {
                const response = await fetch('/api/assessments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.state.auth.token}`
                    },
                    body: JSON.stringify({
                        ...assessment.value,
                        date: new Date().toISOString()
                    })
                })

                if (!response.ok) throw new Error('Failed to submit assessment')

                // Reset form
                Object.keys(assessment.value).forEach(key => {
                    assessment.value[key] = key === 'notes' ? '' : null
                })
                form.value.resetValidation()

                // Show success message
                store.commit('setSnackbar', {
                    text: 'Assessment submitted successfully',
                    color: 'success'
                })

                // Refresh history
                loadAssessmentHistory()
            } catch (error) {
                console.error('Error submitting assessment:', error)
                store.commit('setSnackbar', {
                    text: 'Failed to submit assessment',
                    color: 'error'
                })
            } finally {
                loading.value = false
            }
        }

        const loadAssessmentHistory = async () => {
            try {
                const response = await fetch('/api/assessments', {
                    headers: {
                        'Authorization': `Bearer ${store.state.auth.token}`
                    }
                })
                const data = await response.json()
                assessmentHistory.value = data
            } catch (error) {
                console.error('Error loading assessment history:', error)
            }
        }

        onMounted(() => {
            loadAssessmentHistory()
        })

        return {
            form,
            loading,
            showHistory,
            assessment,
            assessmentHistory,
            categories,
            readinessLabels,
            chartOption,
            getCategoryColor,
            formatDate,
            submitAssessment
        }
    }
}
</script>

<style scoped>
.emotional-readiness {
    min-height: 100vh;
}

.chart {
    height: 400px;
    width: 100%;
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

    .chart {
        height: 300px;
    }

    :deep(.v-slider) {
        margin-top: 24px;
    }

    :deep(.v-slider__tick-label) {
        font-size: 12px;
    }
}
</style>