import "@abraham/reflection";
import { Application } from "./Application";
import { container } from "./di";

const app = container.resolve(Application);
app.run();
