import CustomButton from "./CustomButton";

export default function Header() {
    return (
        <section className="w-full py-16 md:min-h-[calc(100vh-64px)] flex items-center">
            <div className="container mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center px-4">

                {/* Text */}
                <div className="mx-auto space-y-5 max-w-xl">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        Elevate Your Style
                    </h1>

                    <p className="text-gray-600">
                        Discover premium products designed for modern living.
                    </p>

                    <CustomButton className="px-6 py-3 bg-black text-white rounded-xl">
                        Shop Now
                    </CustomButton>
                </div>

                {/* Image */}
                <div className="flex justify-center">
                    <img
                        src="/images/example.jpeg"
                        className="w-full max-w-xs md:max-w-md object-contain"
                    />
                </div>

            </div>
        </section>
    );
}