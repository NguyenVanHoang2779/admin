<template>
    <div>
        <a href='javascript:void(0)'>
            <div class='box' :class="classBT">
                {{labelBT}}
            </div>
        </a>
    </div>
</template>
<script>
export default {
  props: ['classBT', 'labelBT'],
  name: 'ticket-button',
  components: {
  },
  watch: {
  },
  data: () => ({
  }),
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
    $colors: (
            primary: #0275d8,
            success: #28a745,
            danger: #dc3545,
            info: #17a2b8,
    );

    .box::before, .box::after {
        width: 100%;
        height:100%;
        z-index: 3;
        content:'';
        position: absolute;
        top:0;
        left:0;
        box-sizing: border-box;
        -webkit-transform: scale(0);
        transition: 0.3s;
    }

    .box:hover::after, .box:hover::before {
        -webkit-transform: scale(1);
    }

    @each $colorname, $color in $colors {
        .box {
            position:relative;
            vertical-align: middle;
            color: white;
            font-weight: 500;
            height: 40px;
            line-height: 40px;
            text-align: center;
            transition: 0s;
            cursor: pointer;
            -webkit-transition:0s;
        }
        .ticket-button-#{$colorname} {
            border-bottom: 2px solid #ffffff;
            background-color: #b1c6da;
        }
        .ticket-button-#{$colorname}::before {
            border-bottom: 2px solid $color;
            border-left: 2px solid $color;
            -webkit-transform-origin: 0 100%;
        }

        .ticket-button-#{$colorname}::after {
            border-top: 2px solid $color;
            border-right: 2px solid $color;
            -webkit-transform-origin: 100% 0%;
        }
        .ticket-button-#{$colorname}:hover {
            background-color: transparent;
            color: $color;
        }
    }
</style>
