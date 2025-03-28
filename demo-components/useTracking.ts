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

const useTrackingEvents = () : void => {
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

    const onUnmountCallback = () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("touchend", handleTap);
    };

    const onMountCallback = () => {
        onUnmountCallback();
        document.addEventListener("click", handleClick);
        document.addEventListener("touchend", handleTap);
    };

    onMountCallback();
}

export default () => {
    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://cloud.umami.is/script.js";
    script.dataset.websiteId = "19647df5-af82-427b-976f-a2e6f1246a57";
    script.onload = () => {
        useTrackingEvents();
    };
    document.body.appendChild(script);
}