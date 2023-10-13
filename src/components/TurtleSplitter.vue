<script setup>
import { ref, inject, onMounted, onUnmounted } from "vue";
import debounce from "lodash/debounce";

const splitterRef = ref(null);
const { addRenderedSplitter, removeRenderedSplitter } = inject("register");
let componentId = null;
onMounted(() => {
	const vnode = splitterRef.value?.__vnode?.ctx.vnode;
	const paneOnLeft = vnode.el.previousSibling?.getAttribute("data-pane-id");
	const paneOnRight = vnode.el.nextSibling?.getAttribute("data-pane-id");
	componentId = `splitter-${paneOnLeft}-${paneOnRight}`;
	addRenderedSplitter({
		component: vnode.component,
		paneOnLeft,
		paneOnRight,
		id: componentId,
	});
});
onUnmounted(() => {
	removeRenderedSplitter({
		id: componentId,
	});
});

let initialDragClientX = 0;
let resizeValue = ref(0);
let isResizing = ref(false);

const mouseDownHandler = (event) => {
	if (isResizing.value) {
		removeEventListeners();
	}
	isResizing.value = true;
	initialDragClientX = event.clientX;
	addEventListeners();
};

const removeEventListeners = () => {
	document
		.querySelector("body")
		.removeEventListener("mousemove", mouseMoveHandler);
	document
		.querySelector("body")
		.removeEventListener("mouseup", mouseUpHandler);
};

const addEventListeners = () => {
	document
		.querySelector("body")
		.addEventListener("mousemove", mouseMoveHandler);
	document.querySelector("body").addEventListener("mouseup", mouseUpHandler);
};

const mouseMoveHandler = debounce((event) => {
	if (!isResizing.value) return;
	const { clientX } = event;
	resizeValue.value = clientX - initialDragClientX;
});

const mouseUpHandler = debounce(() => {
	if (!isResizing.value) return;
	isResizing.value = false;
	document
		.querySelector("body")
		.removeEventListener("mousemove", mouseMoveHandler);
	document
		.querySelector("body")
		.removeEventListener("mouseup", mouseUpHandler);
});

const resetResizeValue = () => {
	resizeValue.value = 0;
};

defineExpose({
	isResizing,
	resizeValue,
	isSplitter: true,
	resetResizeValue,
});
</script>
<template>
	<span
		class="turtle-pane-splitter__wrapper"
		@mousedown="mouseDownHandler"
		@mousemove="mouseMoveHandler"
		@mouseup="mouseUpHandler"
		ref="splitterRef"
	></span>
</template>
<style lang="scss">
.turtle-pane-splitter {
	&__wrapper {
		width: 1px;
		overflow: visible;
		display: inline-flex;
		position: relative;
		z-index: 1;
		background-color: red;
		cursor: col-resize;
		flex-shrink: 0;
		/*&::before {
			content: "";
			width: 1px;
			left: 0px;
			height: 100%;
			position: absolute;
			background-color: red;
			cursor: col-resize;
		}*/
	}
}
</style>
