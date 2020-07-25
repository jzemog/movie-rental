import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: "phonePipe"
})
export class PhonePipe implements PipeTransform {
  // Transforms a phone before display it. EJ: (123) 456-7890
  transform(value: string): string {
    return "(" + value.slice(0, 3) + ") " + value.slice(3, 6) + "-" + value.slice(6);
  } 
}