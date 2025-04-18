import { Component } from "@angular/core";

@Component({
	selector: "app-for",
	imports: [],
	templateUrl: "./for.component.html",
	styleUrl: "./for.component.scss",
})
export class ForComponent {
	protected users = [{ name: "John" }, { name: "Jane" }, { name: "Jack" }];
}
