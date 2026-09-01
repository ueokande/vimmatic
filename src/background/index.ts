import "reflect-metadata";
import { Application } from "./Application";
import { container } from "./di";

const app = container.get(Application);
app.run();
