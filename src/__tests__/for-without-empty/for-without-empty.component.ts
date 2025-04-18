import { Component } from "@angular/core";

@Component({
	selector: "app-for-without-empty",
	imports: [],
	templateUrl: "./for-without-empty.component.html",
	styleUrl: "./for-without-empty.component.scss",
})
export class ForWithoutEmptyComponent {
	protected users = [{ name: "John" }, { name: "Jane" }, { name: "Jack" }];
}
