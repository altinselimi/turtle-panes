const useUmami = () => {
    return (window as typeof window & { umami: { track: (event_name: string, event_data: Object) => void } }).umami;
};

const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
        func(...args);
    }, wait);
    };
};

const getElementHierarchy = (element: HTMLElement | null) => {
    const hierarchy = [];
    let current = element;
    for (let i = 0; i < 3 && current; i++) {
        hierarchy.push(`${current.tagName.toLowerCase()}.${current.className}`);
        current = current.parentElement;
    }
    while (current && !hierarchy.some((h) => h.includes("section-"))) {
        if (current.className.includes("section-")) {
            hierarchy.push(`${current.tagName.toLowerCase()}.${current.className}`);
            break;
        }
        current = current.parentElement;
    }
    return hierarchy.reverse().join(" > ");
};

export default function useTracking(): { onMountCallback: () => void; onUnmountCallback: () => void } | {} {
    let eventCount = 0;
    const maxEvents = 50;

    const trackEvent = (eventName: string, eventData: Object) => {
        if (eventCount < maxEvents) {
            useUmami().track(eventName, eventData);
            eventCount++;
        }
    };

    const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() === "a" && (target as HTMLAnchorElement).href) {
            trackEvent('link_open', {
                url: (target as HTMLAnchorElement).href,
                content: target.textContent
            });
            return;
        }
        const hierarchy = getElementHierarchy(target);
        trackEvent('click', {
            element: hierarchy,
            content: target.textContent
        });
    };

    const handleTap = debounce((event: TouchEvent) => {
        const target = event.target as HTMLElement;
        const hierarchy = getElementHierarchy(target);
        trackEvent('tap', {
            element: hierarchy
        });
    }, 200);

    const onMountCallback = () => {
        document.addEventListener("click", handleClick);
        document.addEventListener("touchend", handleTap);
    };

    const onUnmountCallback = () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("touchend", handleTap);
    };

    return {
        onMountCallback,
        onUnmountCallback
    };
}