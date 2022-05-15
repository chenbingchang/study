
/**
 * 创建者
 */
abstract class Creator {
  constructor () {
    
  }

  // 工厂方法
  public abstract factoryMethod (): Product;

  /**
   * 依赖产品类的一些其他功能
   */
  public someOperation (): string {
    const product = this.factoryMethod();

    return `对产品进行了某某操作，结果是：${product.operation()}`;
  }
}

/**
 * 具体的创建者，需要重写工厂方法
 */
class ConcreteCreator1 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct1();
  }
}

class ConcreteCreator2 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct2();
  }
}

/**
 * 产品接口，所有的具体的产品都必须实现该接口
 */
interface Product {
  // 所有产品共有的方法
  operation (): string;
}

/**
 * 具体产品
 */
class ConcreteProduct1 implements Product {
  public operation(): string {
    return "ConcreteProduct1 run";
  }
}

class ConcreteProduct2 implements Product {
  public operation(): string {
    return "ConcreteProduct2 run";
  }
}

function clientCode (type: string) {
  let creator: Creator | null = null;

  switch(type) {
    case '1': 
      creator = new ConcreteCreator1();
      break;
    case '2': 
      creator = new ConcreteCreator2();
      break;
  }

  if (!creator) {
    console.log(new Error('类型错误'));

    return ;
  }

  console.log(creator.someOperation());
}

clientCode('1');
clientCode('2');
