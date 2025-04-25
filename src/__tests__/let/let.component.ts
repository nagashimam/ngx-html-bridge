import { Component } from "@angular/core";

@Component({
	selector: "app-let",
	imports: [],
	templateUrl: "./let.component.html",
	styleUrl: "./let.component.scss",
})
export class LetComponent {
	protected baz = "Goodbye";
}
