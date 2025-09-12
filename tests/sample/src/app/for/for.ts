import { Component } from "@angular/core";

@Component({
	selector: "app-for",
	imports: [],
	templateUrl: "./for.html",
	styleUrl: "./for.scss",
})
export class For {
	items: string[] = [...["1", "2", "3"], "one", "two", "three"];
	idText = "id-text";
}
