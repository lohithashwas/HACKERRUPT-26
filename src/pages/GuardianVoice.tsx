export function GuardianVoice() {
    return (
        <div className="w-full h-screen -m-8">
            <iframe
                src="https://protect-r.vercel.app/"
                className="w-full h-full border-0"
                title="GuardianVoice - Women Safety Keyword Detector"
                allow="microphone"
            />
        </div>
    );
}
