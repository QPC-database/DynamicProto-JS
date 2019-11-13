declare module "DynamicProto" {
    /**
     * The delegate signature for the function used as the callback for dynamicProto()
     * @typeparam DPType This is the generic type of the class, used to keep intellisense valid for the proxy instance, even
     * though it is only a proxy that only contains the functions
     * @param theTarget This is the real "this" of the current target object
     * @param baseFuncProxy The is a proxy object which ONLY contains this function that existed on the "this" instance before
     * calling dynamicProto, it does NOT contain properties of this. This is basically equivalent to using the "super" keyword.
     */
    export type DynamicProtoDelegate<DPType> = (theTarget: DPType, baseFuncProxy?: DPType) => void;
    /**
     * Helper function when creating dynamic (inline) functions for classes, this helper performs the following tasks :-
     * - Saves references to all defined base class functions
     * - Calls the delegateFunc with the current target (this) and a base object reference that can be used to call all "super" functions.
     * - Will populate the class prototype for all overridden functions to support class extension that call the prototype instance.
     * Callers should use this helper when declaring all function within the constructor of a class, as mentioned above the delegateFunc is
     * passed both the target "this" and an object that can be used to call any base (super) functions, using this based object in place of
     * super.XXX() (which gets expanded to _super.prototype.XXX()) provides a better minification outcome and also ensures the correct "this"
     * context is maintained as TypeScript creates incorrect references using super.XXXX() for dynamically defined functions i.e. Functions
     * defined in the constructor or some other function (rather than declared as complete typescript functions).
     * ### Usage
     * ```typescript
     * import dynamicProto from "@microsoft/dynamicproto-js";
     * class ExampleClass extends BaseClass {
     *     constructor() {
     *         dynamicProto(ExampleClass, this, (_self, base) => {
     *             // This will define a function that will be converted to a prototype function
     *             _self.newFunc = () => {
     *                 // Access any "this" instance property
     *                 if (_self.someProperty) {
     *                     ...
     *                 }
     *             }
     *             // This will define a function that will be converted to a prototype function
     *             _self.myFunction = () => {
     *                 // Access any "this" instance property
     *                 if (_self.someProperty) {
     *                     // Call the base version of the function that we are overriding
     *                     base.myFunction();
     *                 }
     *                 ...
     *             }
     *             _self.initialize = () => {
     *                 ...
     *             }
     *             // Warnings: While the following will work as _self is simply a reference to
     *             // this, if anyone overrides myFunction() the overridden will be called first
     *             // as the normal JavaScript method resolution will occur and the defined
     *             // _self.initialize() function is actually gets removed from the instance and
     *             // a proxy prototype version is created to reference the created method.
     *             _self.initialize();
     *         });
     *     }
     * }
     * ```
     * @typeparam DPType This is the generic type of the class, used to keep intellisense valid
     * @typeparam DPCls The type that contains the prototype of the current class
     * @param theClass This is the current class instance which contains the prototype for the current class
     * @param target The current "this" (target) reference, when the class has been extended this.prototype will not be the 'theClass' value.
     * @param delegateFunc The callback function (closure) that will create the dynamic function
     */
    export default function dynamicProto<DPType, DPCls>(theClass: DPCls, target: DPType, delegateFunc: DynamicProtoDelegate<DPType>): void;
}