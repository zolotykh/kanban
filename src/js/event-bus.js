import Vue from 'vue';

const EventBus = new Vue();

const EVENT_CARD_MOVING_PLACEMENT = 'card-moving-placement';

export { EventBus, EVENT_CARD_MOVING_PLACEMENT };
