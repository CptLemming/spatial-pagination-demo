import { startWith } from "rxjs/operators";
import { from } from "ix/asynciterable";

import faders from "../data/faders";
import config from "../data/config";
import { filterFaders } from "../utils";
import fadersSubject from "../publishers/faders";

const resolvers = {
  Query: {
    faders: (_parent: unknown, { x = 0, y = 0, dx = 5, dy = 5 }) => {
      return filterFaders(faders, x, y, dx, dy);
    },
    config: () => config,
  },
  Subscription: {
    faders: {
      subscribe: (_parent: unknown, { x = 0, y = 0, dx = 5, dy = 5 }) => {
        const initialFaders = filterFaders(faders, x, y, dx, dy);

        return from(fadersSubject.pipe(startWith({ faders: initialFaders })));
      },
    },
  },
};

export default resolvers;
