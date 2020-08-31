export interface DiagnosticReport{
    id: string,
    name: string,
    filePath: string,
    comment: string,
    uploaded: Date,
    content: [{
        id: string,
        name: string,
        value: string,
        prob: string,
        unit: string,
        ref: string
    }];
}