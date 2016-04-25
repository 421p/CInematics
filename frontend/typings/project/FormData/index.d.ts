interface FormData{
    FormData()
    append(name:string, value:any);
    append(name:string, value:any, filename:string);
    delete(name:string);
    entries():Iterator<FormData>;
    get():any;
    getAll(name:string):any[];
    has():boolean;
    keys():Iterator<FormData>;
    set(name:string, value:any, filename:string);
    set(name:string, value:any);
    values():Iterator<FormData>;
}