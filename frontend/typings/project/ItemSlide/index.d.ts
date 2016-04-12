interface JQuery {
    itemslide(): JQuery;
    itemslide(options: itemslideOptions): JQuery;
    getActiveIndex(): number;
    getCurrentPos(): number;
    nextSlide(): void;
    prevSlide(): void;
    gotoSlide(i: number): void;
    reload(): void;
    addSlide(data:string): void;
    removeSlide(index:number): void;

}

interface itemslideOptions{
    duration?:number;
    swipe_sensitivity?:number;
    isable_slide?:boolean;
    disable_clicktoslide?:boolean;
    disable_autowidth?:boolean;
    disable_scroll?:boolean;
    start?:number;
    pan_threshold?:number;
    one_item?:boolean;
    parent_width?:boolean;
    swipe_out?:boolean;
    left_sided?:boolean;
}