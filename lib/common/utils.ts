export function interceptParameter(functionName: string, callString: string): any {
  const holder = {param: null};

  eval(`function ${functionName}(param) {
    holder.param = param;
  }

  ${callString}`);

  return holder.param;
}

export function interceptParameters(functionName: string, callString: string): any[] {
  const args: any[] = [];

  eval(`function ${functionName}(param) {
    args.push(...arguments);
  }

  ${callString}`);

  return args;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
