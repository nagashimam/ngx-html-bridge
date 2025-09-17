import { Component } from "@angular/core";

@Component({
	selector: "app-if-without-else",
	imports: [],
	templateUrl: "./if-without-else.html",
	styleUrl: "./if-without-else.scss",
})
export class IfWithoutElse {
	users = ["木原", "長島"];
	condition: boolean = true;
}
