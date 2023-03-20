<template>
    <div id="datePicker">
        <DatePicker 
            v-model="date"
            :inputDebounce="300"
            :minDate="minDate"
            :isRequired="required"
            :popover="{ visibility: 'hover', autoHide: true }">
            <template #default="{ inputValue, inputEvents }">
                <input type="text" class="form-control" placeholder="Scadenza" :value="inputValue" v-on="inputEvents" />
            </template>
        </DatePicker>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DatePicker } from 'v-calendar';
import '../assets/datePicker.css';
import 'v-calendar/style.css';

const props = withDefaults(defineProps<{
    minDate?: Date,
    required?: boolean,
    reset?: boolean
}>(), {
    minDate: () => new Date(),
    required: true,
    reset: false
});

const date = ref(new Date());

watch(date, (selection, previus) => {
    emit('update', selection);
})

watch(props, value => {
    if (value.reset) date.value = new Date();
})

const emit = defineEmits<{
    (e: 'update', value: Date): void
}>();

emit('update', date.value);

</script>

<style lang="scss" scoped>

</style>