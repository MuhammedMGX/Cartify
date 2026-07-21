
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export const HelpCenter = () => {

    return (
        <section className="pb-16 md:pb-24 pt-10 md:pt-15">
            <div className="mx-auto max-w-container px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <span className="text-sm font-semibold text-brand-secondary md:text-md">Contact us</span>
                    <h2 className="mt-3 text-display-md font-semibold text-primary md:text-display-lg text-3xl">Get in touch</h2>
                    <p className="mt-4 text-lg text-tertiary md:mt-6 md:text-xl">We'd love to hear from you. Please fill out this form.</p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        console.log("Form data:", data);
                    }}
                    className="mx-auto mt-3 flex flex-col gap-8 md:mt-16 md:max-w-120"
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-x-8 gap-y-6 md:flex-row">
                            <Input   name="firstName"  placeholder="First name"  />
                            <Input   name="lastName" placeholder="Last name"  />
                        </div>
                        <Input  name="email"  type="email" placeholder="you@company.com" />
                        <Input name="phone" type="tel" placeholder="Phone number" />
                        <Textarea  placeholder="Leave us a message..." rows={5} />
                        <div className="flex items-center gap-2 text-sm text-tertiary">  
                            <Checkbox
                                name="privacy"
                            />You agree to our friendly{" "}<a href="#" className="underline underline-offset-4">privacy policy</a>.
                        </div>
                    </div>

                    <Button type="submit">
                        Send message
                    </Button>
                </form>
            </div>
        </section>
    );
};
