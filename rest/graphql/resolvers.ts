import { TestData } from "../types/test-data";

const RootQuery = {
  hello: () => ({ text: 'Hello World!', views: 1245 } as TestData)
};

export default RootQuery;
