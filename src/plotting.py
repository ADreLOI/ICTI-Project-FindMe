import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
from sklearn.metrics import (
    confusion_matrix, accuracy_score, precision_score,
    recall_score, f1_score
)
import sys
import os

# ─────────────────────────────────────────────────────────────
#  CONFIG — edit these if needed
# ─────────────────────────────────────────────────────────────
CSV_PATH   = "../sessione_completa.csv"
OUTPUT_DIR = "output_plots"
DPI        = 300          # export resolution (300 = print quality)
STYLE_BG   = "#FAFAFA"    # slide background (off-white)
ACCENT     = "#1A56DB"    # blue accent
GREEN      = "#0E9F6E"    # true positive / success
RED        = "#E02424"    # false positive / danger
AMBER      = "#D97706"    # warning / FN
GRAY       = "#6B7280"    # neutral
DARK       = "#111827"    # primary text

# ─────────────────────────────────────────────────────────────
#  LOAD DATA
# ─────────────────────────────────────────────────────────────
def load_csv(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        sys.exit(f"[ERROR] File not found: {path}")
    df = pd.read_csv(path)
    required = {"Timestamp", "Occupied", "GroundTruth",
                "mOccupied", "mEmpty", "mUnknown", "ConflictK"}
    missing = required - set(df.columns)
    if missing:
        sys.exit(f"[ERROR] Missing columns: {missing}")
    df = df.sort_values("Timestamp").reset_index(drop=True)
    print(f"[INFO] Loaded {len(df)} rows  |  t={df.Timestamp.min()}..{df.Timestamp.max()}")
    return df

# ─────────────────────────────────────────────────────────────
#  COMPUTE METRICS
# ─────────────────────────────────────────────────────────────
def compute_metrics(df: pd.DataFrame) -> dict:
    y_true = df["GroundTruth"].values
    y_pred = df["Occupied"].values
    cm = confusion_matrix(y_true, y_pred, labels=[1, 0])
    TP, FN = cm[0, 0], cm[0, 1]
    FP, TN = cm[1, 0], cm[1, 1]
    total  = TP + TN + FP + FN
    return {
        "TP": int(TP), "FN": int(FN),
        "FP": int(FP), "TN": int(TN),
        "total": int(total),
        "accuracy":  round(accuracy_score(y_true, y_pred) * 100, 1),
        "precision": round(precision_score(y_true, y_pred, zero_division=0) * 100, 1),
        "recall":    round(recall_score(y_true, y_pred, zero_division=0) * 100, 1),
        "f1":        round(f1_score(y_true, y_pred, zero_division=0) * 100, 1),
        "fnr":       round((FN / (TP + FN) * 100) if (TP + FN) > 0 else 0, 1),
        "fpr":       round((FP / (FP + TN) * 100) if (FP + TN) > 0 else 0, 1),
    }

# ─────────────────────────────────────────────────────────────
#  HELPER — metric card drawn with matplotlib patches
# ─────────────────────────────────────────────────────────────
def draw_metric_card(ax, value_str, label, color,
                     bg="#F0F4FF", note=None):
    ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    ax.axis("off")
    box = FancyBboxPatch((0.04, 0.04), 0.92, 0.92,
                         boxstyle="round,pad=0.04",
                         linewidth=1.2, edgecolor=color,
                         facecolor=bg)
    ax.add_patch(box)
    ax.text(0.5, 0.62, value_str, ha="center", va="center",
            fontsize=22, fontweight="bold", color=color)
    ax.text(0.5, 0.28, label, ha="center", va="center",
            fontsize=9, color=GRAY)
    if note:
        ax.text(0.5, 0.10, note, ha="center", va="center",
                fontsize=7.5, color=GRAY, style="italic")

# ─────────────────────────────────────────────────────────────
#  FIGURE 1 — Time-series belief + ground truth
# ─────────────────────────────────────────────────────────────
def plot_timeseries(df: pd.DataFrame, save_path: str):
    fig = plt.figure(figsize=(16, 9), facecolor=STYLE_BG)
    fig.suptitle("DOWA/DST Fusion Engine — Sensor Belief Over Time",
                 fontsize=16, fontweight="bold", color=DARK, y=0.97)

    gs = gridspec.GridSpec(3, 1, figure=fig,
                           hspace=0.45,
                           top=0.90, bottom=0.08,
                           left=0.07, right=0.97)

    t = df["Timestamp"].values

    # ── Panel 1: mass functions ──
    ax1 = fig.add_subplot(gs[0])
    ax1.fill_between(t, df["mOccupied"], alpha=0.18, color=ACCENT)
    ax1.fill_between(t, df["mEmpty"],    alpha=0.18, color=RED)
    ax1.fill_between(t, df["mUnknown"],  alpha=0.18, color=AMBER)
    ax1.plot(t, df["mOccupied"], color=ACCENT, lw=1.8,  label="m(O) — Occupied")
    ax1.plot(t, df["mEmpty"],    color=RED,    lw=1.8,  label="m(E) — Empty")
    ax1.plot(t, df["mUnknown"],  color=AMBER,  lw=1.4,  label="m(U) — Unknown",
             linestyle="--")
    ax1.set_ylabel("Belief mass", fontsize=10, color=DARK)
    ax1.set_ylim(-0.05, 1.08)
    ax1.set_xlim(t.min(), t.max())
    ax1.set_facecolor(STYLE_BG)
    ax1.tick_params(colors=GRAY, labelsize=8)
    ax1.spines[["top", "right"]].set_visible(False)
    ax1.spines[["left", "bottom"]].set_color("#E5E7EB")
    ax1.legend(fontsize=8.5, loc="upper right",
               framealpha=0.85, edgecolor="#E5E7EB")
    ax1.set_title("Mass functions m(O) · m(E) · m(U)",
                  fontsize=10, color=DARK, pad=6, loc="left")

    # ── Panel 2: ground truth vs prediction ──
    ax2 = fig.add_subplot(gs[1])
    ax2.step(t, df["GroundTruth"], where="post",
             color=GREEN, lw=2.0, label="Ground truth", linestyle="-")
    ax2.step(t, df["Occupied"],    where="post",
             color=ACCENT, lw=1.5, label="Prediction",   linestyle="--",
             alpha=0.85)

    # shade FP regions
    fp_mask = (df["Occupied"] == 1) & (df["GroundTruth"] == 0)
    fn_mask = (df["Occupied"] == 0) & (df["GroundTruth"] == 1)
    if fp_mask.any():
        ax2.fill_between(t, 0, 1,
                         where=fp_mask.values,
                         alpha=0.20, color=RED,
                         label="False positive window")
    if fn_mask.any():
        ax2.fill_between(t, 0, 1,
                         where=fn_mask.values,
                         alpha=0.25, color=AMBER,
                         label="False negative window")

    ax2.set_ylabel("State (0/1)", fontsize=10, color=DARK)
    ax2.set_ylim(-0.15, 1.25)
    ax2.set_xlim(t.min(), t.max())
    ax2.set_yticks([0, 1])
    ax2.set_yticklabels(["EMPTY", "OCC"], fontsize=8)
    ax2.set_facecolor(STYLE_BG)
    ax2.tick_params(colors=GRAY, labelsize=8)
    ax2.spines[["top", "right"]].set_visible(False)
    ax2.spines[["left", "bottom"]].set_color("#E5E7EB")
    ax2.legend(fontsize=8.5, loc="upper right",
               framealpha=0.85, edgecolor="#E5E7EB", ncol=2)
    ax2.set_title("Ground truth vs prediction  (red shading = false positive zone)",
                  fontsize=10, color=DARK, pad=6, loc="left")

    # ── Panel 3: conflict K ──
    ax3 = fig.add_subplot(gs[2])
    ax3.fill_between(t, df["ConflictK"], alpha=0.15, color=GRAY)
    ax3.plot(t, df["ConflictK"], color=GRAY, lw=1.5, label="Conflict K")
    ax3.axhline(0.5, color=RED, lw=1.0, linestyle=":",
                alpha=0.7, label="K = 0.5 threshold")
    ax3.set_ylabel("Conflict K", fontsize=10, color=DARK)
    ax3.set_xlabel("Time (seconds)", fontsize=10, color=DARK)
    ax3.set_ylim(-0.05, 1.08)
    ax3.set_xlim(t.min(), t.max())
    ax3.set_facecolor(STYLE_BG)
    ax3.tick_params(colors=GRAY, labelsize=8)
    ax3.spines[["top", "right"]].set_visible(False)
    ax3.spines[["left", "bottom"]].set_color("#E5E7EB")
    ax3.legend(fontsize=8.5, loc="upper right",
               framealpha=0.85, edgecolor="#E5E7EB")
    ax3.set_title("DST conflict coefficient K  (high K = sensor disagreement)",
                  fontsize=10, color=DARK, pad=6, loc="left")

    plt.savefig(save_path, dpi=DPI, bbox_inches="tight",
                facecolor=STYLE_BG)
    print(f"[SAVED] {save_path}")
    plt.show()

# ─────────────────────────────────────────────────────────────
#  FIGURE 2 — Confusion matrix + metrics dashboard
# ─────────────────────────────────────────────────────────────
def plot_metrics_dashboard(m: dict, save_path: str):
    fig = plt.figure(figsize=(16, 9), facecolor=STYLE_BG)
    fig.suptitle("DOWA/DST Fusion Engine — Validation Dashboard",
                 fontsize=16, fontweight="bold", color=DARK, y=0.97)

    outer = gridspec.GridSpec(2, 2, figure=fig,
                              hspace=0.45, wspace=0.35,
                              top=0.90, bottom=0.06,
                              left=0.06, right=0.97)

    # ── TOP LEFT: confusion matrix heatmap ──
    ax_cm = fig.add_subplot(outer[0, 0])
    cm_data = np.array([[m["TP"], m["FN"]],
                        [m["FP"], m["TN"]]])
    cell_colors = [
        [GREEN, RED],
        [RED,   GREEN]
    ]
    cell_labels = [
        [f"TP\n{m['TP']}", f"FN\n{m['FN']}"],
        [f"FP\n{m['FP']}", f"TN\n{m['TN']}"]
    ]
    cell_alpha = [[0.35, 0.20], [0.20, 0.35]]
    ax_cm.set_xlim(0, 2); ax_cm.set_ylim(0, 2)
    ax_cm.set_facecolor(STYLE_BG)

    for row in range(2):
        for col in range(2):
            x, y = col, 1 - row
            rect = FancyBboxPatch(
                (x + 0.03, y + 0.03), 0.94, 0.94,
                boxstyle="round,pad=0.02",
                facecolor=cell_colors[row][col],
                alpha=cell_alpha[row][col],
                edgecolor=cell_colors[row][col],
                linewidth=1.5
            )
            ax_cm.add_patch(rect)
            ax_cm.text(x + 0.5, y + 0.5, cell_labels[row][col],
                       ha="center", va="center",
                       fontsize=16, fontweight="bold",
                       color=cell_colors[row][col])

    ax_cm.set_xticks([0.5, 1.5])
    ax_cm.set_xticklabels(["Pred. OCCUPIED", "Pred. EMPTY"],
                          fontsize=9, color=DARK)
    ax_cm.set_yticks([0.5, 1.5])
    ax_cm.set_yticklabels(["Act. EMPTY", "Act. OCCUPIED"],
                          fontsize=9, color=DARK)
    ax_cm.xaxis.set_ticks_position("top")
    ax_cm.xaxis.set_label_position("top")
    ax_cm.tick_params(length=0, colors=DARK)
    ax_cm.spines[:].set_visible(False)
    ax_cm.set_title(f"Confusion Matrix  (n = {m['total']} samples)",
                    fontsize=10, color=DARK, pad=18, loc="left")

    # ── TOP RIGHT: 6 metric cards ──
    cards_gs = outer[0, 1].subgridspec(2, 3, hspace=0.35, wspace=0.25)
    card_data = [
        (f"{m['recall']}%",    "Recall",           GREEN,  "#F0FDF4", "Zero false negatives"),
        (f"{m['precision']}%", "Precision",         AMBER,  "#FFFBEB", "FP from radar clutter"),
        (f"{m['f1']}%",        "F1 score",          ACCENT, "#EFF6FF", None),
        (f"{m['accuracy']}%",  "Accuracy",          DARK,   "#F9FAFB", None),
        (f"{m['fnr']}%",       "False neg. rate",   GREEN,  "#F0FDF4", "Critical KPI = 0"),
        (f"{m['fpr']}%",       "False pos. rate",   RED,    "#FFF5F5", None),
    ]
    for i, (val, lbl, col, bg, note) in enumerate(card_data):
        r, c = divmod(i, 3)
        ax_c = fig.add_subplot(cards_gs[r, c])
        draw_metric_card(ax_c, val, lbl, col, bg, note)

    # ── BOTTOM LEFT: bar chart TP/TN/FP/FN ──
    ax_bar = fig.add_subplot(outer[1, 0])
    cats   = ["TP", "TN", "FP", "FN"]
    vals   = [m["TP"], m["TN"], m["FP"], m["FN"]]
    colors = [GREEN, GREEN, RED, RED]
    bars   = ax_bar.bar(cats, vals, color=colors,
                        alpha=0.75, width=0.5,
                        edgecolor="white", linewidth=1.2)
    for bar, v in zip(bars, vals):
        ax_bar.text(bar.get_x() + bar.get_width() / 2,
                    bar.get_height() + 4, str(v),
                    ha="center", va="bottom",
                    fontsize=11, fontweight="bold", color=DARK)
    ax_bar.set_facecolor(STYLE_BG)
    ax_bar.spines[["top", "right"]].set_visible(False)
    ax_bar.spines[["left", "bottom"]].set_color("#E5E7EB")
    ax_bar.tick_params(colors=GRAY, labelsize=10)
    ax_bar.set_ylabel("Count", fontsize=10, color=DARK)
    ax_bar.set_title("Confusion matrix breakdown",
                     fontsize=10, color=DARK, pad=6, loc="left")
    tp_patch = mpatches.Patch(color=GREEN, alpha=0.75, label="Correct")
    fp_patch = mpatches.Patch(color=RED,   alpha=0.75, label="Error")
    ax_bar.legend(handles=[tp_patch, fp_patch],
                  fontsize=8.5, framealpha=0.85,
                  edgecolor="#E5E7EB")

    # ── BOTTOM RIGHT: radar chart (spider) ──
    ax_spider = fig.add_subplot(outer[1, 1], polar=True)
    spider_labels  = ["Recall", "Precision", "F1", "Accuracy",
                      "1-FNR", "1-FPR"]
    spider_vals    = [
        m["recall"]    / 100,
        m["precision"] / 100,
        m["f1"]        / 100,
        m["accuracy"]  / 100,
        1 - m["fnr"]   / 100,
        1 - m["fpr"]   / 100,
    ]
    N     = len(spider_labels)
    angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
    angles += angles[:1]
    vals_plot = spider_vals + spider_vals[:1]

    ax_spider.set_facecolor(STYLE_BG)
    ax_spider.plot(angles, vals_plot, color=ACCENT, lw=2.0)
    ax_spider.fill(angles, vals_plot, color=ACCENT, alpha=0.15)
    ax_spider.set_thetagrids(
        np.degrees(angles[:-1]), spider_labels,
        fontsize=8.5, color=DARK
    )
    ax_spider.set_ylim(0, 1)
    ax_spider.set_yticks([0.25, 0.5, 0.75, 1.0])
    ax_spider.set_yticklabels(["25%", "50%", "75%", "100%"],
                               fontsize=7, color=GRAY)
    ax_spider.grid(color="#E5E7EB", linewidth=0.8)
    ax_spider.set_title("Performance radar",
                        fontsize=10, color=DARK, pad=18, loc="center")

    plt.savefig(save_path, dpi=DPI, bbox_inches="tight",
                facecolor=STYLE_BG)
    print(f"[SAVED] {save_path}")
    plt.show()

# ─────────────────────────────────────────────────────────────
#  FIGURE 3 — Close-up FP window
# ─────────────────────────────────────────────────────────────
def plot_fp_closeup(df: pd.DataFrame, m: dict, save_path: str):
    fp_rows = df[(df["Occupied"] == 1) & (df["GroundTruth"] == 0)]
    if fp_rows.empty:
        print("[INFO] No false positives found — skipping close-up plot.")
        return

    t_start = max(df["Timestamp"].min(), fp_rows["Timestamp"].min() - 20)
    t_end   = min(df["Timestamp"].max(), fp_rows["Timestamp"].max() + 20)
    window  = df[(df["Timestamp"] >= t_start) & (df["Timestamp"] <= t_end)]
    t       = window["Timestamp"].values

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(16, 7),
                                    facecolor=STYLE_BG,
                                    gridspec_kw={"hspace": 0.45,
                                                 "top": 0.88,
                                                 "bottom": 0.09})
    fig.suptitle(
        "DOWA/DST — False Positive Analysis: departure delay window",
        fontsize=14, fontweight="bold", color=DARK, y=0.97
    )

    # beliefs
    ax1.fill_between(t, window["mOccupied"].values, alpha=0.18, color=ACCENT)
    ax1.fill_between(t, window["mEmpty"].values,    alpha=0.18, color=RED)
    ax1.plot(t, window["mOccupied"].values, color=ACCENT, lw=2.0,
             label="m(O) — Occupied")
    ax1.plot(t, window["mEmpty"].values,    color=RED,    lw=2.0,
             label="m(E) — Empty")
    ax1.plot(t, window["mUnknown"].values,  color=AMBER,  lw=1.4,
             linestyle="--", label="m(U) — Unknown")
    ax1.axhline(0.5, color=DARK, lw=0.8, linestyle=":",
                alpha=0.5, label="Decision threshold 0.5")

    fp_mask = (window["Occupied"] == 1) & (window["GroundTruth"] == 0)
    if fp_mask.any():
        ax1.fill_between(t, 0, 1, where=fp_mask.values,
                         alpha=0.12, color=RED, label="FP zone")
        ax1.axvspan(fp_rows["Timestamp"].min(),
                    fp_rows["Timestamp"].max(),
                    alpha=0.06, color=RED)

    ax1.set_ylabel("Belief mass", fontsize=10, color=DARK)
    ax1.set_ylim(-0.05, 1.1); ax1.set_xlim(t.min(), t.max())
    ax1.set_facecolor(STYLE_BG)
    ax1.tick_params(colors=GRAY, labelsize=8)
    ax1.spines[["top", "right"]].set_visible(False)
    ax1.spines[["left", "bottom"]].set_color("#E5E7EB")
    ax1.legend(fontsize=8.5, loc="center right",
               framealpha=0.9, edgecolor="#E5E7EB", ncol=2)
    ax1.set_title(
        f"m(O) remains high after departure (radar clutter-lock) — "
        f"{len(fp_rows)} FP samples  |  t={fp_rows['Timestamp'].min()}–{fp_rows['Timestamp'].max()}",
        fontsize=9, color=RED, pad=5, loc="left"
    )

    # GT vs prediction step
    ax2.step(t, window["GroundTruth"].values, where="post",
             color=GREEN, lw=2.5, label="Ground truth")
    ax2.step(t, window["Occupied"].values,    where="post",
             color=ACCENT, lw=1.8, linestyle="--",
             label="Prediction", alpha=0.85)
    if fp_mask.any():
        ax2.fill_between(t, 0, 1, where=fp_mask.values,
                         alpha=0.15, color=RED, label="FP zone")
    ax2.set_ylabel("State", fontsize=10, color=DARK)
    ax2.set_xlabel("Time (seconds)", fontsize=10, color=DARK)
    ax2.set_ylim(-0.2, 1.35); ax2.set_xlim(t.min(), t.max())
    ax2.set_yticks([0, 1])
    ax2.set_yticklabels(["EMPTY", "OCCUPIED"], fontsize=8)
    ax2.set_facecolor(STYLE_BG)
    ax2.tick_params(colors=GRAY, labelsize=8)
    ax2.spines[["top", "right"]].set_visible(False)
    ax2.spines[["left", "bottom"]].set_color("#E5E7EB")
    ax2.legend(fontsize=8.5, loc="upper right",
               framealpha=0.9, edgecolor="#E5E7EB")
    ax2.set_title(
        "Ground truth drops to 0 but prediction stays OCCUPIED — "
        "root cause: LD2410 clutter-lock at departure",
        fontsize=9, color=DARK, pad=5, loc="left"
    )

    plt.savefig(save_path, dpi=DPI, bbox_inches="tight",
                facecolor=STYLE_BG)
    print(f"[SAVED] {save_path}")
    plt.show()

# ─────────────────────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    df = load_csv(CSV_PATH)
    m  = compute_metrics(df)

    print("\n─── FINAL METRICS ───────────────────────────")
    print(f"  TP={m['TP']}  TN={m['TN']}  FP={m['FP']}  FN={m['FN']}  "
          f"(total={m['total']})")
    print(f"  Accuracy:  {m['accuracy']}%")
    print(f"  Precision: {m['precision']}%")
    print(f"  Recall:    {m['recall']}%")
    print(f"  F1 score:  {m['f1']}%")
    print(f"  FNR:       {m['fnr']}%")
    print(f"  FPR:       {m['fpr']}%")
    print("─────────────────────────────────────────────\n")

    plot_timeseries(
        df,
        save_path=os.path.join(OUTPUT_DIR, "1_timeseries_belief.png")
    )

    plot_metrics_dashboard(
        m,
        save_path=os.path.join(OUTPUT_DIR, "2_metrics_dashboard.png")
    )

    plot_fp_closeup(
        df, m,
        save_path=os.path.join(OUTPUT_DIR, "3_fp_closeup.png")
    )

    print(f"\n[DONE] All plots saved to '{OUTPUT_DIR}/'")