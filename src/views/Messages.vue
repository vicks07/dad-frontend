<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <h1 class="text-h4 mb-6">Messages</h1>

                <v-card>
                    <v-list>
                        <v-list-item v-for="conversation in conversations" :key="conversation.user._id"
                            :to="'/messages/' + conversation.user._id">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ conversation.user.firstName }} {{ conversation.user.lastName }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ conversation.lastMessage?.content || 'No messages yet' }}
                                </v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-chip v-if="conversation.unreadCount" color="primary" small>
                                    {{ conversation.unreadCount }}
                                </v-chip>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Messages',
    computed: {
        ...mapState(['conversations'])
    },
    methods: {
        ...mapActions(['fetchConversations'])
    },
    created() {
        this.fetchConversations();
    }
};
</script>