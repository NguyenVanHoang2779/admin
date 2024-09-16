<template>
    <div>
        <b-table sticky-header :items="items" head-variant="light"></b-table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' },
        { 'heading 1': 'table cell', 'heading 2': 'table cell', 'heading 3': 'table cell' }
      ]
    }
  }
}
</script>
