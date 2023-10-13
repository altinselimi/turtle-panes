<script>
import { useSlots, h, ref, onMounted, onUnmounted, inject } from "vue";

export default {
	props: {
		initialWidth: {
			default: 300,
			type: Number,
		},
		minWidth: {
			default: 150,
			type: Number,
		},
		maxWidth: {
			default: 600,
			type: Number,
		},
		growsOnResize: {
			default: false,
			type: Boolean,
		},
		id: String,
	},
	setup(props, { expose }) {
		const slots = useSlots();
		const paneRef = ref(null);

		let componentId = null;
		const { addRenderedPane, removeRenderedPane } = inject("register");
		onMounted(() => {
			const vnode = paneRef.value?.__vnode?.ctx.vnode;
			componentId = props.id || vnode.component.uid;
			addRenderedPane({
				component: vnode.component,
				id: componentId,
			});
		});
		onUnmounted(() => {
			removeRenderedPane({
				id: componentId,
			});
		});

		const updatePaneWidthBy = ref(0);
		const paneWidth = ref(props.initialWidth);
		const setUpdatePaneWidthBy = (newValue) => {
			const previewWidth = paneWidth.value + newValue;
			const [isMaxWidth, isMinWidth] = [
				previewWidth >= props.maxWidth,
				previewWidth <= props.minWidth,
			];
			console.log("Updating pane :", componentId);

			if (isMaxWidth) {
				return (updatePaneWidthBy.value =
					props.maxWidth - paneWidth.value);
			} else if (isMinWidth) {
				return (updatePaneWidthBy.value =
					(paneWidth.value - props.minWidth) * -1);
			}
			updatePaneWidthBy.value = newValue;
		};
		const setLastWidthUpdate = (newValue) => {
			const newWidth = paneWidth.value + updatePaneWidthBy.value;
			const [isMaxWidth, isMinWidth] = [
				newWidth >= props.maxWidth,
				newWidth <= props.minWidth,
			];
			updatePaneWidthBy.value = 0;
			if (isMaxWidth) {
				return (paneWidth.value = props.maxWidth);
			} else if (isMinWidth) {
				return (paneWidth.value = props.minWidth);
			}
			paneWidth.value += newValue;
		};

		const getPropValue = (fieldName) => props[fieldName];

		const isSetupAlready = ref(false);
		expose({
			setUpdatePaneWidthBy,
			setLastWidthUpdate,
			getPropValue,
			getIsSetupAlready: () => isSetupAlready.value,
			setIsSetupAlready: (value) => (isSetupAlready.value = value),
		});

		return () =>
			h(
				"div",
				{
					class: "turtle-pane__wrapper",
					style: {
						flexBasis: `${
							paneWidth.value + updatePaneWidthBy.value
						}px`,
						flexGrow: props.growsOnResize ? 1 : 0,
						flexShrink: 0,
						wordBreak: "break-all",
					},
					"data-pane-id": props.id,
					ref: paneRef,
				},
				slots,
			);
	},
};
</script>
<style lang="scss">
.turtle-pane {
	&__wrapper {
		border: dashed 1px blue;
	}
}
</style>
