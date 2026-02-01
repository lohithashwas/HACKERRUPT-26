import { useState } from 'react';
import axios from 'axios';
import { FileText, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { Card, CardContent } from "@/components/ui/Card"

interface FIRFormData {
    firId: string;
    // 3. Occurrence of Offence
    occurrenceDay: string;
    occurrenceDate: string;
    occurrenceTime: string;
    infoReceivedDate: string;
    infoReceivedTime: string;
    diaryReferenceEntry: string;
    diaryReferenceTime: string;
    infoType: string;

    // 4. Place of Occurrence
    directionDistance: string;
    beatNo: string;
    address: string;
    outsideLimitPS: string;
    districtName: string;

    // 5. Complainant / Information
    complainantName: string;
    complainantFatherName: string;
    complainantGender: string; // NEW
    complainantAadhaar: string; // NEW
    complainantEmail: string; // NEW
    complainantDOB: string;
    complainantIDDate: string;
    complainantIDPlace: string;
    complainantOccupation: string;
    complainantAddress: string;
    complainantPhone: string;

    // 6. Details of accused
    accusedDetails: string;

    // 7. Reasons for delay
    delayReason: string;

    // 8. Properties stolen
    stolenProperties: string;

    // 10. Total value
    totalValue: string;

    // 11. Inquest Report
    inquestReport: string;

    // 12. Action Taken
    actionTaken: string;
    officerName: string;
    officerRank: string;
    officerNumber: string;

    // General
    incidentType: string;
    description: string;
    policeStation: string;
    [key: string]: string; // Allow index access
}

export function FIRForm() {
    const [formData, setFormData] = useState<FIRFormData>({
        firId: `FIR-${Date.now()}`,
        occurrenceDay: '',
        occurrenceDate: '',
        occurrenceTime: '',
        infoReceivedDate: '',
        infoReceivedTime: '',
        diaryReferenceEntry: '',
        diaryReferenceTime: '',
        infoType: 'Written',
        directionDistance: '',
        beatNo: '',
        address: '',
        outsideLimitPS: '',
        districtName: '',
        complainantName: '',
        complainantFatherName: '',
        complainantGender: '',
        complainantAadhaar: '',
        complainantEmail: '',
        complainantDOB: '',
        complainantIDDate: '',
        complainantIDPlace: '',
        complainantOccupation: '',
        complainantAddress: '',
        complainantPhone: '',
        accusedDetails: '',
        delayReason: '',
        stolenProperties: '',
        totalValue: '',
        inquestReport: '',
        actionTaken: 'Registered the case and took up the investigation',
        officerName: '',
        officerRank: '',
        officerNumber: '',
        incidentType: 'Theft',
        description: '',
        policeStation: 'Virtual Cyber Station'
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generatePDF = async (data: any, txHash: string, dataHash: string) => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Helper to load image
            const loadImage = (src: string): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve(img);
                    img.onerror = (e) => reject(e);
                });
            };

            // Load Logos
            let logoGovt = null;
            let logoPolice = null;
            try {
                // Use absolute path with origin to avoid issues
                const baseUrl = window.location.origin;
                logoGovt = await loadImage(`${baseUrl}/logos/tn_govt.png`);
                logoPolice = await loadImage(`${baseUrl}/logos/tn_police.png`);
            } catch (err) {
                console.warn("Logos failed to load", err);
            }

            // Logos
            if (logoGovt) doc.addImage(logoGovt, 'PNG', 10, 5, 25, 25);
            if (logoPolice) doc.addImage(logoPolice, 'PNG', pageWidth - 35, 5, 25, 25);

            // Title Text
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("GOVERNMENT OF TAMIL NADU", pageWidth / 2, 15, { align: "center" });
            doc.setFontSize(12);
            doc.text("TAMIL NADU POLICE DEPARTMENT", pageWidth / 2, 22, { align: "center" });

            // Main Heading
            doc.setFontSize(16);
            doc.setTextColor(220, 0, 0); // Red
            doc.text("FIRST INFORMATION REPORT (E-FIR)", pageWidth / 2, 35, { align: "center" });

            // Red Line
            doc.setDrawColor(220, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(10, 38, pageWidth - 10, 38);

            doc.setTextColor(0, 0, 0); // Reset black

            // --- Info Block (Top) ---
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            let yPos = 50;

            doc.text(`District: ${data.districtName || 'Chennai'}`, 15, yPos);
            yPos += 6;
            doc.text(`Police Station: ${data.policeStation}`, 15, yPos);

            yPos -= 6;
            doc.text(`Year: ${new Date().getFullYear()}`, pageWidth - 60, yPos);
            yPos += 6;
            doc.text(`FIR No: ${data.firId}`, pageWidth - 60, yPos);

            yPos += 12;
            doc.text(`Date & Time of Incident: ${data.occurrenceDate} ${data.occurrenceTime ? ', ' + data.occurrenceTime : ''}`, 15, yPos);
            yPos += 6;
            doc.text(`Date of Report: ${new Date().toLocaleString()}`, 15, yPos);

            yPos += 10;

            const addSectionHeader = (title: string) => {
                doc.setFillColor(230, 230, 230);
                doc.rect(10, yPos, pageWidth - 20, 8, 'F');
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.text(title, 15, yPos + 5.5);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                yPos += 14;
            };

            addSectionHeader("1. Complainant Details");
            const labelX = 15;
            const valueX = 60;

            doc.setFont("helvetica", "bold");
            doc.text("Name", labelX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(data.complainantName || 'N/A', valueX, yPos);
            yPos += 7;

            doc.setFont("helvetica", "bold");
            doc.text("Aadhaar No", labelX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(data.complainantAadhaar || 'N/A', valueX, yPos);
            yPos += 7;

            doc.setFont("helvetica", "bold");
            doc.text("Contact No", labelX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(data.complainantPhone || 'N/A', valueX, yPos);
            yPos += 7;

            doc.setFont("helvetica", "bold");
            doc.text("Email ID", labelX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(data.complainantEmail || 'N/A', valueX, yPos);
            yPos += 7;

            doc.setFont("helvetica", "bold");
            doc.text("Address", labelX, yPos);
            doc.setFont("helvetica", "normal");
            const splitAddress = doc.splitTextToSize(data.complainantAddress || 'N/A', 120);
            doc.text(splitAddress, valueX, yPos);
            yPos += (splitAddress.length * 5) + 5;

            addSectionHeader("2. Incident Details");
            doc.setFont("helvetica", "bold");
            doc.text("Type of Offense", labelX, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(data.incidentType || 'General', valueX, yPos);
            yPos += 7;

            doc.setFont("helvetica", "bold");
            doc.text("Description", labelX, yPos);
            doc.setFont("helvetica", "normal");
            const splitDesc = doc.splitTextToSize(data.description || data.stolenProperties || 'N/A', 120);
            doc.text(splitDesc, valueX, yPos);
            yPos += (splitDesc.length * 5) + 5;

            // Footer
            const footerY = 250;
            doc.setDrawColor(220, 0, 0);
            doc.setLineWidth(1);
            doc.rect(10, footerY, pageWidth - 20, 30, 'S');

            doc.setFontSize(9);
            doc.setTextColor(220, 0, 0);
            doc.setFont("courier", "bold");
            doc.text("IMMUTABLE BLOCKCHAIN RECORD - PROTECT-R", pageWidth / 2, footerY + 8, { align: "center" });

            doc.setTextColor(100, 100, 100);
            doc.setFont("courier", "normal");
            doc.setFontSize(7);
            doc.text(`TX HASH: ${txHash}`, 15, footerY + 16);
            doc.text(`DIGITAL FINGERPRINT: ${dataHash}`, 15, footerY + 24);

            doc.save(`EFIR_${data.firId}.pdf`);
        } catch (e: any) {
            console.error("PDF Fail", e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const payload = { ...formData };
            // Hit the new backend server
            const response = await axios.post('http://localhost:3000/api/create-fir', payload);

            if (response.data.success) {
                setResult(response.data);
                generatePDF({ ...formData }, response.data.transactionHash, response.data.dataHash);
            } else {
                throw new Error(response.data.message || "Submission failed");
            }
        } catch (err: any) {
            console.error("Error:", err);
            setError(err.response?.data?.message || err.message || 'System Error. Ensure Backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ label, name, type = "text", placeholder, required = false, colSpan = 1 }: any) => (
        <div className={`form-group ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
        </div>
    );

    const TextAreaField = ({ label, name, rows = 3, placeholder, required = false }: any) => (
        <div className="form-group w-full">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
            <textarea
                name={name}
                rows={rows}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Shield className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">E-FIR Registration</h2>
                        <p className="text-sm text-gray-400">Official Format Under Section 154 Cr.P.C.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-mono text-xs">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Ledger Status: Connected
                </div>
            </div>

            {!result ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Office Use & Occurrence
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="District" name="districtName" placeholder="e.g. Chennai" />
                                <div className="form-group">
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Police Station</label>
                                    <input type="text" value={formData.policeStation} disabled className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
                                </div>
                                <InputField label="Incident Date" name="occurrenceDate" type="date" />
                                <InputField label="Incident Time" name="occurrenceTime" type="time" />
                                <InputField label="Occurrence Day" name="occurrenceDay" placeholder="e.g. Monday" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">Complainant Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Full Name" name="complainantName" required />
                                <InputField label="Aadhaar Number" name="complainantAadhaar" required placeholder="12-digit UID" />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Gender" name="complainantGender" placeholder="M/F/O" />
                                    <InputField label="Date of Birth" name="complainantDOB" />
                                </div>
                                <InputField label="Contact No" name="complainantPhone" required />
                                <InputField label="Email ID" name="complainantEmail" type="email" />
                                <InputField label="Address" name="complainantAddress" colSpan={2} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-dark-card border-gray-800">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">Case Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Offense Type" name="incidentType" />
                                <TextAreaField label="Brief Description" name="description" colSpan={2} />
                                <InputField label="Investigating Officer" name="officerName" required />
                                <InputField label="Officer Rank" name="officerRank" required />
                            </div>
                        </CardContent>
                    </Card>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2" disabled={loading}>
                        {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Recording on Ledger...</> : <><FileText className="w-5 h-5" /> Submit & Generate Official FIR</>}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                        </div>
                    )}
                </form>
            ) : (
                <div className="text-center py-12 animate-in zoom-in duration-300">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 text-green-500 mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Record Successfully Sealed</h2>
                    <p className="text-gray-400 mb-10 max-w-md mx-auto">The FIR has been encrypted and stored on the immutable blockchain ledger. Official PDF download complete.</p>

                    <div className="bg-gray-900/80 p-6 rounded-xl text-left text-sm font-mono space-y-4 mb-10 border border-gray-800 max-w-lg mx-auto relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                        <div className="flex justify-between border-b border-gray-800 pb-3">
                            <span className="text-gray-500">TX HASH</span>
                            <span className="text-blue-400 text-[10px] break-all text-right ml-4">{result.transactionHash}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-3">
                            <span className="text-gray-500">BLOCK NO</span>
                            <span className="text-white">#{result.blockNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">STATUS</span>
                            <span className="text-green-500 font-bold">COMMITTED</span>
                        </div>
                    </div>

                    <button onClick={() => setResult(null)} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 transition-colors">
                        File New Record
                    </button>
                </div>
            )}
        </div>
    );
}
