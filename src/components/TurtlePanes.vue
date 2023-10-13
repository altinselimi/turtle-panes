<script>
import { h, useSlots, ref, provide, watchEffect, nextTick } from "vue";

export default {
	setup(props) {
		const slots = useSlots();
		const turtlePanesRef = ref(null);

		const renderedPanes = ref([]);
		const renderedSplitters = ref([]);
		const splitterWatchers = [];

		const addRenderedPane = (renderedPane) => {
			renderedPanes.value.push(renderedPane);
		};
		const removeRenderedPane = (renderedPane) => {
			const idx = renderedPanes.value.findIndex(
				(p) => p.id === renderedPane.id,
			);
			renderedPanes.value.splice(idx, 1);
		};

		const addRenderedSplitter = (renderedSplitter) => {
			console.log(renderedSplitter);
			renderedSplitters.value.push(renderedSplitter);
			const renderedSplitterWatcher = watchEffect(() =>
				splitterWatcherHandler(renderedSplitter, renderedPanes.value),
			);
			splitterWatchers.push(renderedSplitterWatcher);
		};
		const removeRenderedSplitter = (renderedSplitter) => {
			const idx = renderedSplitters.value.findIndex(
				(s) => s.id === renderedSplitter.id,
			);
			renderedSplitters.value.splice(idx, 1);
			splitterWatchers[idx]();
			splitterWatchers.splice(idx, 1);
		};

		const register = {
			addRenderedPane,
			removeRenderedPane,
			addRenderedSplitter,
			removeRenderedSplitter,
		};
		provide("register", register);

		const splitterWatcherHandler = (renderedSplitter, idx) => {
			const renderedSplitterComponent =
				renderedSplitter?.component?.exposed;
			if (!renderedSplitterComponent) return;
			const resizeValue = renderedSplitterComponent.resizeValue?.value;
			const isResizing = renderedSplitterComponent.isResizing?.value;
			const paneOnLeftIdx = renderedPanes.value.findIndex(
				(p) => p.id === renderedSplitter.paneOnLeft,
			);
			const paneOnRightIdx = renderedPanes.value.findIndex(
				(p) => p.id === renderedSplitter.paneOnRight,
			);
			const [paneOnLeft, paneOnRight] = [
				renderedPanes.value[paneOnLeftIdx]?.component?.exposed,
				renderedPanes.value[paneOnRightIdx]?.component?.exposed,
			];
			console.log({
				paneOnLeft,
				paneOnRight,
			});
			const [leftGrowsOnResize, rightGrowsOnResize] = [
				paneOnLeft?.getPropValue("growsOnResize"),
				paneOnRight?.getPropValue("growsOnResize"),
			];

			let method = !isResizing
				? "setLastWidthUpdate"
				: "setUpdatePaneWidthBy";
			const targetPane = leftGrowsOnResize ? paneOnRight : paneOnLeft;
			if (!targetPane) return;

			targetPane[method](
				leftGrowsOnResize ? resizeValue * -1 : resizeValue,
			);

			if (!isResizing) {
				renderedSplitterComponent.resetResizeValue();
			}
		};

		return () =>
			h(
				"div",
				{ class: "turtle-panes__wrapper", ref: turtlePanesRef },
				slots,
			);
	},
};
</script>
<style lang="scss">
.turtle-panes {
	&__wrapper {
		display: flex;
		flex: 1;
	}
}
</style>
