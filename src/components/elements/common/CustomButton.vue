<template>
    <div>
        <a href='javascript:void(0)'>
            <div class='box' :class="classBT">{{$slots.default[0].text}}</div>
        </a>
    </div>
</template>
<script>
export default {
  props: ['classBT'],
  name: 'custom-button'
}
</script>

<style scoped lang="scss">
    $colors: (
            primary: (#0275d8, #2a5c86),
            success: (#28a745, #246633),
            danger: (#dc3545, #8d343c),
            info: (#17a2b8, #246069),
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
            /*padding: 0 10px;*/
            cursor: pointer;
            -webkit-transition:0s;
        }
        .button-custom-#{$colorname} {
            border-bottom: 2px solid #ffffff;
            background-color: nth($color, 2);
        }
        .button-custom-#{$colorname}::before {
            border-bottom: 2px solid nth($color, 1);
            border-left: 2px solid nth($color, 1);
            -webkit-transform-origin: 0 100%;
        }

        .button-custom-#{$colorname}::after {
            border-top: 2px solid nth($color, 1);
            border-right: 2px solid nth($color, 1);
            -webkit-transform-origin: 100% 0%;
        }
        .button-custom-#{$colorname}:hover {
            background-color: transparent;
            color: nth($color, 1);
        }
    }
</style>
